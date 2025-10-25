import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import MoodTracker from '../components/MoodTracker';
import {
  UtensilsIcon, CalendarIcon, TrophyIcon, PlusIcon, ChevronRightIcon,
  HeartIcon, ActivityIcon, BarChart3Icon, TrendingUpIcon, DropletIcon, BrainIcon, StarIcon 
} from 'lucide-react';
// @ts-ignore
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/Dashboard.css';

// Types
interface UserProgress {
  calories: number;
  protein: number;
  water: number;
  carbs: number;
  fats: number;
  fiber: number;
}

interface Meal {
  time: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface UserData {
  name: string;
  goal: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyWater: number;
  progress: UserProgress;
  meals: Meal[];
  streak: number;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface GoalContent {
  greeting: string;
  primaryMetric: string;
  primaryIcon: React.ReactNode;
  secondaryMetric: string;
  secondaryValue: string;
  secondaryIcon: React.ReactNode;
  tip: string;
  quickActions: QuickAction[];
}

//  Default user data
const defaultUserData: UserData = {
  name: '',
  goal: 'eat-healthier',
  dailyCalories: 2000,
  dailyProtein: 75,
  dailyWater: 2,
  progress: { calories: 0, protein: 0, water: 0, carbs: 0, fats: 0, fiber: 0 },
  meals: [],
  streak: 0
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);   //state

  // NEW: daily summaries state (minimal change)
  const [dailySummaries, setDailySummaries] = useState<any[]>([]);
 
  // NEW: weekly totals state
    const [weeklyTotals, setWeeklyTotals] = useState({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    });

    const [userPoints, setUserPoints] = useState<number | null>(null);

useEffect(() => {
  const fetchUserPoints = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const profileRef = doc(db, "users", user.uid);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data();
      setUserPoints(data.points || 0);
    } else {
      setUserPoints(0);
    }
  };
  fetchUserPoints();
}, []);


  // Fetch meal history from Firebase (unchanged)
  useEffect(() => {
    const fetchMeals = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const mealRef = collection(db, "users", user.uid, "meals");
        const q = query(mealRef, orderBy("createdAt", "desc"), limit(10));
        const snap = await getDocs(q);
        const mealData = snap.docs.map(doc => doc.data());

        //Fetch today's Day Total summary
        const today = new Date().toISOString().split("T")[0];
        const summaryRef = doc(db, "users", user.uid, "dailySummaries", today);
        const summarySnap = await getDoc(summaryRef);
        if (summarySnap.exists()) {
          const summary = summarySnap.data();
          mealData.unshift({
            mealType: summary.mealType || "Day Total",
            mealText: summary.description || "No summary available",
            createdAt: summary.analysisCreatedAt || new Date().toISOString(),
          });
        }

        setMeals(mealData);
      } catch (e) {
        console.error("Error fetching meals:", e);
      }
    };
    fetchMeals();
  }, []);


  // NEW: fetch daily summaries (only this new effect)
  useEffect(() => {
    const fetchDailySummaries = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const dailyRef = collection(db, "users", user.uid, "dailySummaries");
        // fetch without orderBy and sort client-side for safety
        const snap = await getDocs(dailyRef);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // sort descending by id (YYYY-MM-DD) so newest first
        list.sort((a: any, b: any) => b.id.localeCompare(a.id));
        setDailySummaries(list);
      } catch (e) {
        console.error("Error fetching daily summaries:", e);
      }
    };
    fetchDailySummaries();
  }, []);

  // Compute weekly totals whenever dailySummaries change
    useEffect(() => {
      const last7Days = dailySummaries.slice(0, 7); // already sorted newest first
      if (last7Days.length > 0) {
        const totals = last7Days.reduce(
          (acc, day) => {
            const t = day.totals || {};
            acc.calories += t.calories || 0;
            acc.protein += t.protein || 0;
            acc.carbs += t.carbs || 0;
            acc.fats += t.fats || 0;
            return acc;
          },
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
        setWeeklyTotals(totals);
      }
    }, [dailySummaries]);

  // Fetch user data from Firebase and merge with defaults
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              ...defaultUserData,
              name: data.firstName || defaultUserData.name,
              goal: data.goal || defaultUserData.goal,
              dailyCalories: data.dailyCalories || defaultUserData.dailyCalories,
              dailyProtein: data.dailyProtein || defaultUserData.dailyProtein,
              dailyWater: data.dailyWater || defaultUserData.dailyWater,
              progress: data.progress || defaultUserData.progress,
              meals: data.meals || defaultUserData.meals,
              streak: data.streak || defaultUserData.streak
            });
          } else {
            console.log('No such user document! Using defaults.');
            setUserData(defaultUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(defaultUserData);
        }
      }
    };
    fetchUserData();
  }, []);

  // Goal-specific content
  const goalSpecificContent = (): GoalContent => {
    switch (userData.goal) {
      case 'lose-weight':
        return {
          greeting: "Let's focus on your calorie deficit today",
          primaryMetric: 'Calories',
          primaryIcon: <ActivityIcon size={28} className="text-emerald-500" />,
          secondaryMetric: 'Steps',
          secondaryValue: '2,450 / 10,000',
          secondaryIcon: <TrendingUpIcon size={28} className="text-blue-500" />,
          tip: 'Try to maintain a 500 calorie deficit each day for sustainable weight loss',
          quickActions: [
            { label: 'Log Meal', icon: <UtensilsIcon size={16} className="text-emerald-500" />, path: '/log-meal' },
            { label: 'Track Steps', icon: <TrendingUpIcon size={16} className="text-blue-500" />, path: '/activity' },
            { label: 'View Challenge', icon: <TrophyIcon size={16} className="text-amber-500" />, path: '/challenges' }
          ]
        };
      case 'gain-muscle':
        return {
          greeting: 'Focus on protein and strength today',
          primaryMetric: 'Protein',
          primaryIcon: <ActivityIcon size={24} className="text-emerald-500" />,
          secondaryMetric: 'Strength',
          secondaryValue: '1/2 workouts',
          secondaryIcon: <TrendingUpIcon size={24} className="text-blue-500" />,
          tip: 'Aim for 1.6-2g of protein per kg of bodyweight for optimal muscle growth',
          quickActions: [
            { label: 'Log Meal', icon: <UtensilsIcon size={16} className="text-emerald-500" />, path: '/log-meal' },
            { label: 'Log Workout', icon: <ActivityIcon size={16} className="text-blue-500" />, path: '/workouts' },
            { label: 'Protein Foods', icon: <TrophyIcon size={16} className="text-amber-500" />, path: '/pantry' }
          ]
        };
      case 'maintain-weight':
        return {
          greeting: 'Maintain your balance today',
          primaryMetric: 'Balance',
          primaryIcon: <BarChart3Icon size={24} className="text-emerald-500" />,
          secondaryMetric: 'Nutrients',
          secondaryValue: '7/9 vitamins',
          secondaryIcon: <HeartIcon size={24} className="text-blue-500" />,
          tip: 'Focus on nutrient diversity while maintaining your calorie balance',
          quickActions: [
            { label: 'Log Meal', icon: <UtensilsIcon size={16} className="text-emerald-500" />, path: '/log-meal' },
            { label: 'Nutrient Report', icon: <HeartIcon size={16} className="text-blue-500" />, path: '/nutrients' },
            { label: 'View Plan', icon: <CalendarIcon size={16} className="text-amber-500" />, path: '/meal-plan' }
          ]
        };
      case 'improve-energy':
        return {
          greeting: "Let's boost your energy levels today",
          primaryMetric: 'Energy',
          primaryIcon: <BrainIcon size={24} className="text-emerald-500" />,
          secondaryMetric: 'Sleep',
          secondaryValue: '7.5/8 hours',
          secondaryIcon: <HeartIcon size={24} className="text-blue-500" />,
          tip: 'Complex carbs provide sustained energy throughout the day',
          quickActions: [
            { label: 'Log Meal', icon: <UtensilsIcon size={16} className="text-emerald-500" />, path: '/log-meal' },
            { label: 'Energy Foods', icon: <BrainIcon size={16} className="text-blue-500" />, path: '/pantry' },
            { label: 'Track Mood', icon: <HeartIcon size={16} className="text-amber-500" />, path: '/mood' }
          ]
        };
      default:
        return {
          greeting: 'Focus on nutrient-dense foods today',
          primaryMetric: 'Nutrition',
          primaryIcon: <HeartIcon size={24} className="text-emerald-500" />,
          secondaryMetric: 'Vegetables',
          secondaryValue: '3/5 servings',
          secondaryIcon: <DropletIcon size={24} className="text-blue-500" />,
          tip: 'Try to include at least 5 different colored vegetables and fruits today',
          quickActions: [
            { label: 'Log Meal', icon: <UtensilsIcon size={16} className="text-emerald-500" />, path: '/log-meal' },
            { label: 'Nutrition Report', icon: <HeartIcon size={16} className="text-blue-500" />, path: '/nutrients' },
            { label: 'Healthy Recipes', icon: <CalendarIcon size={16} className="text-amber-500" />, path: '/meal-plan' }
          ]
        };
    }
  };

  const goalContent = goalSpecificContent();

  const handleMoodSubmit = (mood: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (mood.toLowerCase().includes('happy') || mood.toLowerCase().includes('good')) {
        setAiResponse("Great to hear you're feeling good today! This positive energy can help you make better food choices. I suggest capitalizing on this by preparing some healthy meals for later in the week.");
      } else if (mood.toLowerCase().includes('sad') || mood.toLowerCase().includes('down') || mood.toLowerCase().includes('depressed')) {
        setAiResponse("I'm sorry you're feeling down today. Some foods can help boost your mood - try adding foods rich in omega-3 fatty acids like salmon or walnuts to your next meal.");
      } else if (mood.toLowerCase().includes('tired') || mood.toLowerCase().includes('exhausted') || mood.toLowerCase().includes('low energy')) {
        setAiResponse('Feeling tired can make nutrition choices harder. Focus on hydration and consider a small protein-rich snack with complex carbs for sustained energy.');
      } else if (mood.toLowerCase().includes('stressed') || mood.toLowerCase().includes('anxious')) {
        setAiResponse('Stress can affect your eating patterns. Try magnesium-rich foods like dark chocolate, avocados, or nuts which may help reduce stress levels.');
      } else {
        setAiResponse("Thanks for sharing how you're feeling. Remember that your mood and nutrition are connected. I'll keep this in mind for today's recommendations.");
      }
    }, 1500);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome, {userData.name}!</h1>
            <p className="dashboard-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}{' '}
              • {goalContent.greeting}
            </p>
          </div>
          <div className="dashboard-action">
            <Button icon={<PlusIcon size={18} />} onClick={() => navigate('/log-meal')}>Log Meal</Button>
          </div>
        </div>

        {/* Nutrition Summary - Weekly Totals */}
          <div className="dashboard-grid">
            <Card className="col-span-1 md:col-span-1">
              <h2 className="nutrition-card-title">Weekly Nutrition Totals</h2>
              <div className="nutrition-stats">
                <div className="stat-card stat-card-primary">
                  <div className="stat-icon-container stat-icon-primary">
                    <ActivityIcon size={28} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="stat-label">Calories</p>
                    <p className="stat-value">{weeklyTotals.calories} kcal</p>
                  </div>
                </div>
                <div className="stat-card stat-card-secondary">
                  <div className="stat-icon-container stat-icon-secondary">
                    <ActivityIcon size={28} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="stat-label">Protein</p>
                    <p className="stat-value">{weeklyTotals.protein} g</p>
                  </div>
                </div>
                <div className="stat-card stat-card-tertiary">
                  <div className="stat-icon-container stat-icon-tertiary">
                    <ActivityIcon size={28} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="stat-label">Carbs</p>
                    <p className="stat-value">{weeklyTotals.carbs} g</p>
                  </div>
                </div>
                <div className="stat-card stat-card-quaternary p-3 bg-pink-50 rounded-lg flex items-center gap-3">
              <div className="stat-icon-container stat-icon-quaternary bg-pink-100 p-2 rounded-full">
                <ActivityIcon size={28} className="text-pink-500" />
              </div>
              <div>
                <p className="stat-label text-pink-600 font-medium">Fats</p>
                <p className="stat-value text-pink-700 font-semibold">{weeklyTotals.fats} g</p>
              </div>
            </div>
              </div>
              {/* User Points Card */}
              <Card className="col-span-1 md:col-span-1">
                <h2 className="quick-actions-title">Your Points</h2>
                <div className="flex items-center justify-between mt-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StarIcon size={28} className="text-yellow-500" />
                    <div>
                      <p className="stat-label font-medium text-yellow-700">Total Points</p>
                    <p className="stat-value text-lg font-bold text-yellow-800">
                      {userPoints !== null ? `${userPoints} pts` : "Loading..."}
                    </p>
                   </div>
                    </div>
                    <Button
                      onClick={() => navigate("/challenges")}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium border border-yellow-300 transition-all"
                    >
                      Go to Challenges
                    </Button>


                  </div>
                </Card>

            </Card>


            {/* Quick Actions */}
            <Card>
              <h2 className="quick-actions-title">Quick Actions</h2>
              <div className="action-list">
                {goalContent.quickActions.map((action, index) => (
                  <button key={index} onClick={() => navigate(action.path)} className="action-button">
                    <div className="flex items-center">
                      <div className="action-icon-container">{action.icon}</div>
                      <span className="action-label">{action.label}</span>
                    </div>
                    <ChevronRightIcon size={16} className="action-arrow" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

        {/* Mood Tracker & Progress */}
        <div className="dashboard-grid">
          <div className="md:col-span-2">
            <MoodTracker onSubmitMood={handleMoodSubmit} aiResponse={aiResponse} isLoading={isLoading} />
          </div>
        </div>

        {/* Meal History */}
        <Card className="backdrop-blur-lg bg-white/60 border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
          <h2 className="nutrition-card-title mb-4 text-gray-800">Meal History</h2>

          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="min-w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-emerald-100/70 text-gray-800 text-left">
                  <th className="py-3 px-4 font-semibold">Meal Type</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Calories</th>
                  <th className="py-3 px-4 font-semibold text-right">Protein</th>
                  <th className="py-3 px-4 font-semibold text-right">Carbs</th>
                  <th className="py-3 px-4 font-semibold text-right">Fat</th>
                  <th className="py-3 px-4 font-semibold">Logged At</th>
                </tr>
              </thead>
              <tbody>
                {dailySummaries.length > 0 ? (
                  dailySummaries.map((day) => {
                    const totals = day.totals || {};
                    const formattedDate = new Date(`${day.id}T00:00:00`).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });

                    // order of meal rows
                    const types = ["breakfast", "lunch", "dinner", "snack"];

                    // find first existing meal index to show totals on first row
                    const firstExistingIndex = types.findIndex(t => !!day[t]);

                    return (
                      <React.Fragment key={day.id}>
                        {types.map((t, idx) => {
                          const meal = day[t];
                          if (!meal) return null;

                          const showTotals = idx === firstExistingIndex;

                          return (
                            <tr key={`${day.id}-${t}`} className="border-b border-gray-100 hover:bg-emerald-50/60 transition-colors">
                              <td className="py-3 px-4 capitalize font-medium">{t}</td>
                              <td className="py-3 px-4 max-w-md truncate" title={meal.mealText}>{meal.mealText}</td>

                              <td className="py-3 px-4 text-right">
                                {showTotals && totals.calories ? <span className="font-semibold">{totals.calories}</span> : <span>—</span>}
                              </td>

                              <td className="py-3 px-4 text-right">{showTotals && totals.protein ? `${totals.protein} g` : "—"}</td>
                              <td className="py-3 px-4 text-right">{showTotals && totals.carbs ? `${totals.carbs} g` : "—"}</td>
                              <td className="py-3 px-4 text-right">{showTotals && totals.fats ? `${totals.fats} g` : "—"}</td>

                              <td className="py-3 px-4 text-gray-500">
                                {meal.createdAt ? (
                                  new Date(meal.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                                ) : formattedDate}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Day totals separator row */}
                        <tr className="bg-emerald-50/60 border-t border-emerald-100">
                          <td className="py-3 px-4 font-semibold text-emerald-700">Day Total</td>

                          {/* Show bullet list for description */}
                          <td className="py-3 px-4 whitespace-pre-line text-sm text-gray-700">
                            {day.description ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {day.description.split("\n").map((line: string, i: number) => (
                                  <li key={i}>{line}</li>
                                ))}
                              </ul>
                            ) : (
                              <span>—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{totals.calories ?? "—"}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{totals.protein ? `${totals.protein} g` : "—"}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{totals.carbs ? `${totals.carbs} g` : "—"}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">{totals.fats ? `${totals.fats} g` : "—"}</td>
                          <td className="py-3 px-4 text-gray-500">{formattedDate}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">No daily logs yet. Go log meals from <b>Log Meal</b>!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;


