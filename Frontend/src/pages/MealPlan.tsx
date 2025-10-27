import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ShoppingBagIcon,
  CheckIcon,
  CalendarIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion } from "framer-motion";

/* Types */
type SingleMeal = {
  title: string;
  description?: string;
  calories?: number;
  protein?: number;
  completed?: boolean;
};

type DayPlan = {
  day: string;
  meals: {
    breakfast: SingleMeal;
    lunch: SingleMeal;
    snack: SingleMeal;
    dinner: SingleMeal;
    [key: string]: SingleMeal;
  };
};

type BackendResponse = {
  message?: string;
  plan?: { days: DayPlan[] } | DayPlan[]; // backend returns { plan: { days: [...] } }
  generatedAt?: string;
  error?: string;
};

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

/* SweetAlert2 glass base */
const swalBase = {
  customClass: {
    popup: "glass-popup",
    title: "font-bold text-lg",
    content: "text-sm text-gray-700",
    confirmButton: "px-4 py-2 rounded-md",
    denyButton: "px-4 py-2 rounded-md",
  },
  showClass: { popup: "swal2-show-pop" },
  hideClass: { popup: "swal2-hide-pop" },
} as any;

const MealPlan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state || {}) as { plan?: { days: DayPlan[] }; generatedAt?: string };

  const uid = localStorage.getItem("uid") || "G7C0dWJNR3ZOOTO5HmI9l2f099z1";

  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Inline glassmorphism styles for SweetAlert2
  useEffect(() => {
    const style = document.createElement("style") as HTMLStyleElement;
    style.innerHTML = `
    .glass-popup {
      background: rgba(255,255,255,0.74) !important;
      backdrop-filter: blur(8px) saturate(120%);
      box-shadow: 0 10px 30px rgba(2,6,23,0.12);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.5);
    }
    .swal2-show-pop { transform: scale(.985); animation: popIn .22s forwards; }
    .swal2-hide-pop { transform: scale(1); animation: popOut .14s forwards; }
    @keyframes popIn { to { transform: scale(1); } }
    @keyframes popOut { to { transform: scale(.98); opacity: 0; } }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);


  // Normalize backend shapes to DayPlan[]
  const normalize = (data: BackendResponse): DayPlan[] => {
    const p = (data?.plan as any) ?? data;
    if (!p) return [];
    if (Array.isArray(p)) return p as DayPlan[];
    if (Array.isArray(p?.days)) return p.days as DayPlan[];

    // fallback: try to map days if present as an object
    const daysArr = p.days || [];
    if (!Array.isArray(daysArr) || daysArr.length === 0) return [];

    return daysArr.map((d: any, i: number) => ({
      day: d?.day || `Day ${i + 1}`,
      meals: d?.meals || {},
    }));
  };

  useEffect(() => {
    const loadAndSavePlan = async () => {
      try {
        setLoading(true);
        const planDocRef = doc(db, "users", uid, "mealData", "mealPlan");

        // If user navigated with a freshly generated plan, use it and save to Firestore
        if (navState?.plan?.days && Array.isArray(navState.plan.days) && navState.plan.days.length) {
          const days = navState.plan.days;
          setPlan(days);

          // only reset activeDay if current index is invalid (or first mount)
          setActiveDay((cur) => {
            if (typeof cur !== "number") return 0;
            if (cur < 0 || cur >= days.length) return 0;
            return cur;
          });

          await setDoc(planDocRef, { days });
          setLoading(false);
          return;
        }


        // Otherwise, attempt to load the last saved plan from Firestore
        const snap = await getDoc(planDocRef);
        if (snap.exists()) {
          const saved = snap.data();
          if (saved?.days && Array.isArray(saved.days)) {
            const days = saved.days;
            setPlan(days);
            setActiveDay((cur) => {
              if (typeof cur !== "number") return 0;
              if (cur < 0 || cur >= days.length) return 0;
              return cur;
            });
          }
        }

      } catch (err) {
        console.error("Error loading/saving meal plan:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAndSavePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState, uid]);

  // total calories helper
  const activePlan = plan[activeDay] ?? null;
  const totalCaloriesForDay = useMemo(() => {
    if (!activePlan) return 0;
    return Object.values(activePlan.meals).reduce((acc: number, m: any) => acc + (Number(m?.calories) || 0), 0);
  }, [activePlan]);

  //total protein helper
  const activePlanProtein  = plan[activeDay] ?? null;
  const totalProteinForDay = useMemo(() => {
    if (!activePlan) return 0;
    return Object.values(activePlan.meals).reduce((acc: number, m: any) => acc + (Number(m?.protein) || 0), 0);
  }, [activePlan]);

  // Extract ingredients from meal plan and check against pantry
  const checkIngredientsAndAddToGrocery = async (mealPlanDays: DayPlan[]) => {
    try {
      Swal.fire({
        ...swalBase,
        title: "Analyzing Ingredients...",
        html: "Extracting ingredients from your meal plan...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
      });

      // Collect all meal descriptions
      const allMealDescriptions: string[] = [];
      mealPlanDays.forEach((day) => {
        Object.values(day.meals).forEach((meal) => {
          if (meal.description) {
            allMealDescriptions.push(meal.description);
          } else if (meal.title) {
            allMealDescriptions.push(meal.title);
          }
        });
      });

      if (allMealDescriptions.length === 0) {
        Swal.fire({
          ...swalBase,
          icon: "warning",
          title: "No Meal Descriptions",
          text: "Your meal plan doesn't have detailed descriptions to analyze.",
        });
        return;
      }

      // Use backend API to analyze and extract ingredients from meal descriptions
      const ingredientsNeeded: { [key: string]: { quantity: number; category: string } } = {};
      
      for (const mealDesc of allMealDescriptions) {
        try {
          // Call backend API to analyze meal and get ingredients
          const response = await fetch(`${API}/meals/analyze-ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mealDesc }),
          });

          if (response.ok) {
            const data = await response.json();
            
            // Process the foods returned by Nutritionix
            if (data.foods && Array.isArray(data.foods)) {
              data.foods.forEach((food: any) => {
                const foodName = food.food_name?.toLowerCase() || '';
                const servingQty = food.serving_qty || 1;
                
                if (foodName) {
                  // Determine category based on food tags or name
                  let category = 'Other';
                  const tags = food.tags || {};
                  
                  if (tags.item === 'Meat' || tags.item === 'Poultry' || tags.item === 'Fish' || 
                      ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'lamb', 'turkey', 'egg'].some(m => foodName.includes(m))) {
                    category = 'Protein';
                  } else if (tags.item === 'Grains' || ['rice', 'bread', 'pasta', 'noodles', 'quinoa', 'oats', 'cereal'].some(g => foodName.includes(g))) {
                    category = 'Grains';
                  } else if (tags.item === 'Vegetable' || tags.item === 'Vegetables' ||
                      ['tomato', 'lettuce', 'carrot', 'onion', 'garlic', 'pepper', 'broccoli', 'spinach', 'cucumber', 'potato'].some(v => foodName.includes(v))) {
                    category = 'Vegetables';
                  } else if (tags.item === 'Fruit' || tags.item === 'Fruits' ||
                      ['apple', 'banana', 'orange', 'berry', 'mango', 'grape', 'lemon', 'strawberry'].some(f => foodName.includes(f))) {
                    category = 'Fruits';
                  } else if (tags.item === 'Dairy' || ['milk', 'cheese', 'yogurt', 'butter', 'cream'].some(d => foodName.includes(d))) {
                    category = 'Dairy';
                  }
                  
                  // Add or update ingredient
                  if (!ingredientsNeeded[foodName]) {
                    ingredientsNeeded[foodName] = { quantity: 0, category };
                  }
                  ingredientsNeeded[foodName].quantity += servingQty;
                }
              });
            }
          }
        } catch (error) {
          console.error('Error analyzing meal:', mealDesc, error);
          // Continue with next meal even if one fails
        }
      }

      // Helper function to normalize item names (handle singular/plural)
      const normalizeItemName = (name: string): string => {
        const normalized = name.toLowerCase().trim();
        
        // Remove common plural endings
        if (normalized.endsWith('ies')) {
          return normalized.slice(0, -3) + 'y'; // berries -> berry
        } else if (normalized.endsWith('oes')) {
          return normalized.slice(0, -2); // tomatoes -> tomato
        } else if (normalized.endsWith('ses')) {
          return normalized.slice(0, -2); // glasses -> glass
        } else if (normalized.endsWith('s') && !normalized.endsWith('ss')) {
          return normalized.slice(0, -1); // carrots -> carrot, eggs -> egg
        }
        
        return normalized;
      };

      // Get pantry items
      const pantryRef = collection(db, 'users', uid, 'pantry');
      const pantrySnapshot = await getDocs(query(pantryRef));
      const pantryItems: { [key: string]: number } = {};
      const pantryItemsNormalized: { [key: string]: number } = {};
      
      pantrySnapshot.docs.forEach((doc) => {
        const item = doc.data();
        const itemName = (item.name || '').toLowerCase().trim();
        if (itemName) {
          pantryItems[itemName] = (item.quantity || 0);
          // Also store normalized version
          const normalized = normalizeItemName(itemName);
          pantryItemsNormalized[normalized] = (pantryItemsNormalized[normalized] || 0) + (item.quantity || 0);
        }
      });

      // Get existing grocery items to avoid duplicates
      const groceryRef = collection(db, 'users', uid, 'grocery');
      const grocerySnapshot = await getDocs(query(groceryRef));
      const existingGroceryItems = new Set<string>();
      
      grocerySnapshot.docs.forEach((doc) => {
        const item = doc.data();
        const itemName = (item.name || '').toLowerCase().trim();
        if (itemName) {
          existingGroceryItems.add(itemName);
        }
      });

      // Helper function to check if ingredient exists (handles partial matches and plurals)
      const isIngredientAvailable = (ingredient: string): boolean => {
        const ingredientLower = ingredient.toLowerCase().trim();
        const ingredientNormalized = normalizeItemName(ingredientLower);
        
        // Check exact match in grocery list
        if (existingGroceryItems.has(ingredientLower)) {
          return true;
        }
        
        // Check normalized form match
        for (const groceryItem of existingGroceryItems) {
          const groceryNormalized = normalizeItemName(groceryItem);
          
          // Match if normalized forms are the same
          if (groceryNormalized === ingredientNormalized) {
            return true;
          }
          
          // Check if one contains the other
          if (groceryItem.includes(ingredientLower) || ingredientLower.includes(groceryItem)) {
            return true;
          }
          
          // Check if normalized forms contain each other
          if (groceryNormalized.includes(ingredientNormalized) || ingredientNormalized.includes(groceryNormalized)) {
            return true;
          }
        }
        
        return false;
      };

      // Check which ingredients are missing or insufficient in pantry
      const itemsToAdd: { name: string; category: string; quantity: number }[] = [];
      
      Object.entries(ingredientsNeeded).forEach(([ingredient, data]) => {
        const ingredientLower = ingredient.toLowerCase().trim();
        const ingredientNormalized = normalizeItemName(ingredientLower);
        
        // Check if available in pantry with sufficient quantity (check both exact and normalized)
        const exactQty = pantryItems[ingredientLower] || 0;
        const normalizedQty = pantryItemsNormalized[ingredientNormalized] || 0;
        const availableQty = Math.max(exactQty, normalizedQty);
        
        const shortfall = data.quantity - availableQty;
        
        // Only add if:
        // 1. There's a shortfall (need more than available in pantry)
        // 2. Not already in grocery list
        if (shortfall > 0 && !isIngredientAvailable(ingredientLower)) {
          itemsToAdd.push({
            name: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
            category: data.category,
            quantity: Math.ceil(shortfall),
          });
        }
      });

      // Add missing items to grocery list
      if (itemsToAdd.length > 0) {
        const addPromises = itemsToAdd.map((item) =>
          addDoc(collection(db, 'users', uid, 'grocery'), {
            name: item.name,
            category: item.category,
            checked: false,
            createdAt: serverTimestamp(),
          })
        );
        
        await Promise.all(addPromises);
        
        const totalIngredients = Object.keys(ingredientsNeeded).length;
        const alreadyAvailable = totalIngredients - itemsToAdd.length;
        
        let message = `Added <b>${itemsToAdd.length}</b> new item(s) to your grocery list.`;
        if (alreadyAvailable > 0) {
          message += `<br><br><b>${alreadyAvailable}</b> item(s) already available in pantry or grocery list.`;
        }
        message += `<br><br>Check the Pantry page to view them.`;
        
        await Swal.fire({
          ...swalBase,
          icon: "info",
          title: "🛒 Grocery List Updated!",
          html: message,
          confirmButtonColor: "#10B981",
        });
      } else {
        const totalIngredients = Object.keys(ingredientsNeeded).length;
        
        await Swal.fire({
          ...swalBase,
          icon: "success",
          title: "✅ All Set!",
          html: totalIngredients > 0 
            ? `All <b>${totalIngredients}</b> ingredients are already in your pantry or grocery list!`
            : "No ingredients found in meal descriptions.",
          confirmButtonColor: "#10B981",
        });
      }
    } catch (error) {
      console.error('Error checking ingredients:', error);
      await Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Error",
        text: "Failed to analyze ingredients. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  // fetch/generate plan from backend (used as fallback or regenerate)
  const fetchPlan = async (showSwal = true) => {
    try {
      setGenerating(true);
      setLoading(true);
      if (showSwal) {
        Swal.fire({
          ...swalBase,
          title: "Generating 7-day plan",
          html: "Creating a balanced, tasty 7-day plan — hang on a sec 🍽",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          showConfirmButton: false,
        });
      }

      const res = await fetch(`${API}/meals/generate-plan/${uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data: BackendResponse = await res.json();

      if (!res.ok || data?.error || (data.plan && (data.plan as any).error)) {
        const msg = data?.message || data?.error || ((data.plan as any)?.error) || "Failed to generate plan";
        Swal.fire({ ...swalBase, icon: "error", title: "Could not generate plan", text: String(msg) });
        setGenerating(false);
        setLoading(false);
        return;
      }

      const days = normalize(data);
      if (!days || days.length === 0) {
        Swal.fire({ ...swalBase, icon: "warning", title: "No plan returned", text: "AI didn't return a plan — try again." });
        setGenerating(false);
        setLoading(false);
        return;
      }

      setPlan(days);
      setActiveDay((cur) => {
        if (typeof cur !== "number") return 0;
        if (cur < 0 || cur >= days.length) return 0;
        return cur;
      });
      await setDoc(doc(db, "users", uid, "mealData", "mealPlan"), { days });

      await Swal.fire({
        ...swalBase,
        icon: "success",
        title: "AI Meal Plan Generated!",
        text: data.message || "Your weekly plan is ready.",
        confirmButtonColor: "#10B981",
      });

      // Check ingredients and add missing items to grocery list
      await checkIngredientsAndAddToGrocery(days);
    } catch (err: any) {
      console.error("generate error", err);
      Swal.fire({ ...swalBase, icon: "error", title: "Network error", text: err?.message || "Something went wrong." });
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  // Log meal action (popup)
  const handleLogMeal = (mealTime: string, meal: SingleMeal) => {
    Swal.fire({
      ...swalBase,
      title: `Log ${mealTime}?`,
      html: `<strong>${meal.title}</strong><div class="mt-2 text-sm text-gray-600">${meal.description || ""}</div>`,
      showCancelButton: true,
      confirmButtonText: "Log it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10B981",
    }).then((result) => {
      if (result.isConfirmed) {
        // a real implementation would call your log endpoint here
        Swal.fire({ ...swalBase, icon: "success", title: "Logged!", text: `${meal.title} added to your food log.`, timer: 1200, showConfirmButton: false });
      }
    });
  };

  const handleSwapMeal = (mealTime: string) => {
    Swal.fire({ ...swalBase, title: `Swap ${mealTime}`, text: "Swap feature coming soon.", confirmButtonColor: "#10B981" });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-800 mr-4">
            <ChevronLeftIcon size={20} />
            <span className="ml-3">Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white ">Your 7-Day Meal Plan</h1>

          <div className="ml-auto flex items-center space-x-5">
            <Button
              size="lg"
              className="bg-blue-300 text-emerald-600 hover:bg-blue-700"
              onClick={() =>
                Swal.fire({
                  ...swalBase,
                  title: "Regenerate Plan?",
                  text: "This will create a brand new plan. Continue?",
                  showCancelButton: true,
                  confirmButtonText: "Regenerate",
                  confirmButtonColor: "#10B981",
                }).then((r) => {
                  if (r.isConfirmed) {
                    return fetchPlan(true);
                  }
                })
              }
            >
              Regenerate Plan
            </Button>
            <Button
              size="lg"
              className="bg-purple-400 hover:bg-purple-600 text-white"
              onClick={async () => {
                if (!plan || plan.length === 0) {
                  Swal.fire({ 
                    ...swalBase, 
                    icon: "warning", 
                    title: "No Meal Plan", 
                    text: "Please generate a meal plan first." 
                  });
                  return;
                }
                await checkIngredientsAndAddToGrocery(plan);
              }}
            >
              <ShoppingBagIcon size={18} className="mr-2" />
              Check Pantry & Add to Grocery
            </Button>
          </div>
        </div>

        {/* Day selector */}
        <div className="mb-8 overflow-x-auto">

          <div className="inline-flex space-x-3">
            {(plan.length ? plan.map((p) => p.day) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map((label, idx) => {
              const isActive = idx === activeDay;

              // optional: show day-of-week for the corresponding date (kept simple here)
              const weekday = new Date().toLocaleDateString(undefined, { weekday: "short" });

              return (
                <motion.button
                  key={`${label}-${idx}`}
                  onClick={() => setActiveDay(idx)}
                  whileHover={{ y: -3 }}
                  className={`px-8 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-shadow shadow-sm ${isActive ? "bg-emerald-300 text-white ring-emerald-100" : "bg-white text-white-700 hover:bg-gray-50"
                    }`}
                >
                  <div className="text-sm opacity-80">{weekday}</div>
                  <div className="mt-1">{label}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center mr-3">
                <CalendarIcon size={20} className="text-emerald-500" />
              </div>

              <div>
                <h2 className="font-semibold text-xl text-gray-900">{activePlan ? activePlan.day : "Day"}'s Meals</h2>
                <div className="text-sm text-gray-500">{activePlan ? "Personalized by AI" : "No plan loaded"}</div>
              </div>

            </div>
            <div className="text-sm text-gray-600">Total: ~{totalCaloriesForDay || 0} calories</div>
            <div className="text-sm text-gray-600">Protein: ~{totalProteinForDay || 0} g</div>
          </div>


          {/* Table view */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dish</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Calories</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Protein</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {activePlan ? (
                  Object.entries(activePlan.meals).map(([mealTime, m]: any, idx) => {
                    const meal: SingleMeal = m;
                    return (
                      <tr key={mealTime} className="hover:shadow-sm transition-shadow">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{mealTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{meal.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{meal.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{meal.calories ?? "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{meal.protein ? `${meal.protein} g` : "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleLogMeal(mealTime, meal)}
                              className={`inline-flex items-center px-3 py-1.5 text-sm rounded-lg ${meal.completed ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border border-gray-200 hover:bg-emerald-50"
                                }`}
                              disabled={meal.completed}
                            >
                              {meal.completed ? (
                                <>
                                  <CheckIcon size={14} className="text-emerald-500 mr-2" />
                                  Logged
                                </>
                              ) : (
                                <>
                                  <PlusIcon size={14} className="mr-2" />
                                  Log
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleSwapMeal(mealTime)}
                              className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                            >
                              Swap
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      {loading ? "Generating plan..." : "No plan loaded. Click \"Regenerate Plan\" to create one."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-3">
              <Button variant="outline" icon={<ChevronLeftIcon size={16} />} onClick={() => setActiveDay(Math.max(0, activeDay - 1))} disabled={activeDay === 0}>
                Prev
              </Button>
              <Button icon={<ChevronRightIcon size={16} />} onClick={() => setActiveDay(Math.min((plan.length || 7) - 1, activeDay + 1))} disabled={activeDay >= (plan.length - 1)}>
                Next
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => fetchPlan(true)} disabled={generating}>
                {generating ? "Generating..." : "Generate AI Plan"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Nutritional insights */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-gray-800">Nutritional Insights</h2>
            <div className="text-sm text-gray-500">Based on your goals</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white 600  mb-3">Daily Targets</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Calories</span>
                    <span className="text-gray-800">{totalCaloriesForDay} / 2100 kcal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5">
                    <div className="bg-emerald-400 h-5 rounded-full" style={{ width: `${Math.min(100, (totalCaloriesForDay / 2100) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Protein</span>
                    <span className="text-gray-800">{totalProteinForDay} / 150 g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5">
                    <div className="bg-orange-400 h-5 rounded-full" style={{ width: `${Math.min(100, (totalProteinForDay / 150) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">AI Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Add turmeric to dinner—it supports digestion and reduces inflammation</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Consider having your snack between lunch and dinner when energy typically dips</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Drink a glass of water before each meal to help with portion control</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </Layout >
  );
};

export default MealPlan;
