import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import { MicIcon, SendIcon, BarChart3Icon, RotateCcwIcon, InfoIcon } from "lucide-react";
import { auth } from "../firebaseConfig";

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

/* small reusable toast */
const Toast = ({ kind, text, onClose }: { kind: "success" | "warning" | "error"; text: string; onClose?: () => void }) => {
  const bg = kind === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : kind === "warning" ? "bg-amber-50 border-amber-200 text-amber-800"
    : "bg-red-50 border-red-200 text-red-800";
  return (
    <div className={`${bg} border p-3 rounded-xl shadow-sm flex items-start gap-3`}>
      <div className="flex-1 text-sm">{text}</div>
      {onClose && <button className="text-xs opacity-70" onClick={onClose}>Dismiss</button>}
    </div>
  );
};

const LogMeal: React.FC = () => {
  const navigate = useNavigate();
  const [mealText, setMealText] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [isRecording, setIsRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "warning" | "error"; text: string } | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev: any) => {
      const t = ev.results[0][0].transcript;
      setMealText(prev => prev ? `${prev}. ${t}` : t);
      setIsRecording(false);
    };
    r.onerror = () => setIsRecording(false);
    recognitionRef.current = r;
    return () => { try { recognitionRef.current?.stop(); } catch {} };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  const toggleVoice = () => {
    if (!recognitionRef.current) { setToast({ kind: "warning", text: "Voice not supported in this browser." }); return; }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setToast({ kind: "error", text: "Couldn’t start voice capture." });
      }
    }
  };

  // Save draft / log single meal (saves to backend, backend stores draft or processed)
  const handleSaveDraft = async () => {
    const user = auth.currentUser;
    if (!user) { setToast({ kind: "error", text: "Sign in to save meal." }); return; }
    if (!mealText.trim()) { setToast({ kind: "warning", text: "Please enter your meal." }); return; }

    setBusy(true);
    try {
      const res = await fetch(`${API}/meals/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, mealType, mealText }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setToast({ kind: "success", text: j.message || `${mealType} saved.` });
      setMealText("");
    } catch (e) {
      console.error(e);
      setToast({ kind: "error", text: "Could not save meal." });
    } finally { setBusy(false); }
  };

  // Analyze — server will check >=3 meals rule, call Nutritionix and return analysis;
  // If server returns plan in response, we will use it.
  const handleAnalyze = async () => {
    const user = auth.currentUser;
    if (!user) { setToast({ kind: "error", text: "Sign in to analyze." }); return; }
    setBusy(true);
    try {
      const res = await fetch(`${API}/meals/analyze/${user.uid}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Analyze failed");
      if (j.analysis) {
        setAnalysis(j.analysis);
        setToast({ kind: "success", text: j.message || "Nutrition analysis ready." });
      } else {
        setAnalysis(null);
        setToast({ kind: "warning", text: j.message || "Please log Breakfast, Lunch and Dinner to analyze." });
      }
    } catch (e) {
      console.error(e);
      setToast({ kind: "error", text: "Analysis failed." });
    } finally { setBusy(false); }
  };

  // Generate plan (backend should respond with plan+generatedAt). On success navigate to meal-plan passing plan.
  const handleGeneratePlan = async () => {
    const user = auth.currentUser;
    if (!user) { setToast({ kind: "error", text: "Sign in to generate plan." }); return; }
    setBusy(true);
    try {
      const res = await fetch(`${API}/meals/generate-plan/${user.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // keep body to prevent JSON parse error
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Generate failed");
      // j should contain { plan, generatedAt }
      if (j.plan) {
        setToast({ kind: "success", text: j.message || "Weekly plan generated." });
        // navigate and pass plan to avoid empty MealPlan view
        navigate("/meal-plan", { state: { plan: j.plan, generatedAt: j.generatedAt } });
        return;
      } else {
        // fallback: navigate and MealPlan will fetch
        setToast({ kind: "success", text: j.message || "Plan generated. Opening meal plan..." });
        navigate("/meal-plan");
      }
    } catch (e) {
      console.error(e);
      setToast({ kind: "error", text: "Could not generate meal plan." });
    } finally { setBusy(false); }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Log Meal</h1>
          <p className="text-sm text-gray-500">Tip: be detailed for accurate analysis</p>
        </div>

        {/* toast */}
        <div className="mb-4">{toast && <Toast kind={toast.kind} text={toast.text} onClose={() => setToast(null)} />}</div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* left - input */}
          <Card>
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-semibold text-gray-800">Describe your meal</h2>
              <div className="text-xs text-gray-500">Meal type & time</div>
            </div>

            <textarea
              value={mealText}
              onChange={(e) => setMealText(e.target.value)}
              rows={5}
              placeholder="e.g., Breakfast: two boiled eggs, 1 cup rice, and a banana"
              className="w-full p-4 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />

            <div className="flex items-center gap-3 mt-4">
              <select value={mealType} onChange={(e) => setMealType(e.target.value as any)} className="p-2 rounded-lg border">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>

              <Button onClick={handleSaveDraft} icon={<SendIcon size={14} />} disabled={busy}>
                {busy ? "Saving..." : "Save Draft"}
              </Button>

              <button onClick={toggleVoice} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isRecording ? "bg-red-50 text-red-600" : "bg-white"}`}>
                <MicIcon /> <span className="text-sm">{isRecording ? "Listening..." : "Voice"}</span>
              </button>

              <Button variant="outline" onClick={handleAnalyze} icon={<BarChart3Icon size={14} />} disabled={busy}>
                Analyze Day
              </Button>
            </div>
          </Card>

          {/* right - analysis */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Nutrition Analysis</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => { setAnalysis(null); setMealText(""); }} className="text-xs text-gray-500">Clear</button>
                <button onClick={() => setAnalysis(null)} className="text-xs text-gray-500">Reset</button>
              </div>
            </div>

            {!analysis ? (
              <div className="py-14 text-center text-gray-500">
                <div className="mb-3 inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-100">
                  <BarChart3Icon />
                </div>
                <p className="font-medium mb-1">No analysis yet</p>
                <p className="text-sm">Log breakfast, lunch and dinner then click Analyze</p>
              </div>
            ) : (
              <div>
                {/* example analysis card — adapt if backend returns different shape */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-emerald-50 text-center">
                    <div className="text-xs text-gray-600">Calories</div>
                    <div className="text-lg font-bold">{analysis.calories}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 text-center">
                    <div className="text-xs text-gray-600">Protein</div>
                    <div className="text-lg font-bold">{analysis.protein} g</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 text-center">
                    <div className="text-xs text-gray-600">Carbs</div>
                    <div className="text-lg font-bold">{analysis.carbs} g</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 text-center">
                    <div className="text-xs text-gray-600">Fats</div>
                    <div className="text-lg font-bold">{analysis.fats} g</div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button onClick={handleGeneratePlan} icon={<InfoIcon size={14} />}>Generate Meal Plan</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LogMeal;
