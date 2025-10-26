import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { LockIcon, StarIcon, CheckCircleIcon } from "lucide-react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Challenges.css";
import { createChallengeNotification, createAchievementNotification } from '../services/notificationService';

const WATER_GOAL_MALE = 15.5;
const WATER_GOAL_FEMALE = 11.5;
const DAILY_MEAL_GOAL = 3;
const WEEKLY_WATER_GOAL = 100;
const WEEKLY_MEAL_GOAL = 21; // 3 meals * 7 days

interface CompletedChallenge {
  id: number;
  title: string;
  description: string;
  completedDate: string;
  points: number;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
}

const Challenges: React.FC = () => {
  const user = auth.currentUser;
  const [selectedTab, setSelectedTab] = useState<"active" | "completed" | "badges">("active");
  const [cupsDrunk, setCupsDrunk] = useState(0);
  const [dailyWaterGoal, setDailyWaterGoal] = useState(0);
  const [mealsLogged, setMealsLogged] = useState(0);
  const [weeklyProgressWater, setWeeklyProgressWater] = useState(0);
  const [weeklyProgressMeals, setWeeklyProgressMeals] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([
    { id: 1, name: "Hydration Hero", description: "Drink 100 cups of water in a week", image: "💧", unlocked: false },
    { id: 2, name: "Meal Master", description: "Log all meals daily for a week", image: "🍽️", unlocked: false },
    { id: 3, name: "Fit Foodie Star", description: "Complete your first challenge", image: "⭐", unlocked: false },
    { id: 4, name: "Daily Challenger", description: "Complete all daily goals", image: "🔥", unlocked: false },
  ]);
  const [points, setPoints] = useState(0);

  const todayId = new Date().toISOString().split("T")[0];
  const currentWeek = getCurrentWeekId();

  function getCurrentWeekId() {
    const date = new Date();
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    return `${weekStart.getFullYear()}-W${weekStart.getMonth() + 1}-${weekStart.getDate()}`;
  }

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    const profileRef = doc(db, "users", user.uid);
    const dailyRef = doc(db, `users/${user.uid}/dailyChallenges/${todayId}`);
    const weeklyRef = doc(db, `users/${user.uid}/weeklyChallenge/${currentWeek}`);

    const [profileSnap, dailySnap, weeklySnap] = await Promise.all([
      getDoc(profileRef),
      getDoc(dailyRef),
      getDoc(weeklyRef),
    ]);

    let gender = "female";
    let userPoints = 0;
    let userBadges: string[] = [];

    if (profileSnap.exists()) {
      const data = profileSnap.data();
      gender = data.gender || "female";
      userPoints = data.points || 0;
      userBadges = data.badges || [];
      setPoints(userPoints);
      setBadges((prev) =>
        prev.map((b) => ({ ...b, unlocked: userBadges.includes(b.name) }))
      );
    } else {
      await setDoc(profileRef, { points: 0, badges: [], createdAt: serverTimestamp() });
    }

    const waterGoal = gender === "male" ? WATER_GOAL_MALE : WATER_GOAL_FEMALE;
    setDailyWaterGoal(waterGoal);

    if (dailySnap.exists()) {
      const data = dailySnap.data();
      setCupsDrunk(data.waterIntake || 0);
      setMealsLogged(data.mealsLogged || 0);
    } else {
      await setDoc(dailyRef, { waterIntake: 0, mealsLogged: 0, completed: false });
    }

    if (weeklySnap.exists()) {
      const data = weeklySnap.data();
      setWeeklyProgressWater(data.waterDrank || 0);
      setWeeklyProgressMeals(data.mealsLogged || 0);
    } else {
      await setDoc(weeklyRef, {
        waterDrank: 0,
        mealsLogged: 0,
        goalWater: WEEKLY_WATER_GOAL,
        goalMeals: WEEKLY_MEAL_GOAL,
        completed: false,
        startDate: serverTimestamp(),
      });
    }
  };

  const addPoints = async (pointsEarned: number) => {
    if (!user) return;
    const profileRef = doc(db, "users", user.uid);
    const newTotal = points + pointsEarned;
    setPoints(newTotal);
    await updateDoc(profileRef, { points: newTotal });
  };

  const unlockBadge = async (badgeName: string) => {
    if (!user) return;
    const profileRef = doc(db, "users", user.uid);

    setBadges((prev) =>
      prev.map((b) => (b.name === badgeName ? { ...b, unlocked: true } : b))
    );

    const profileSnap = await getDoc(profileRef);
    const existingBadges = profileSnap.exists() ? profileSnap.data().badges || [] : [];
    if (!existingBadges.includes(badgeName)) {
      await updateDoc(profileRef, { badges: [...existingBadges, badgeName] });
      
      // Notify when badge is unlocked (only for new badges)
      try {
        await createAchievementNotification(
          user.uid,
          `Badge Unlocked: ${badgeName} 🏆`
        );
      } catch (error) {
        console.error('Error creating badge unlock notification:', error);
      }
    }
  };

  const addCompleted = async (title: string, description: string, pts: number, badgeToUnlock?: string) => {
    if (completedChallenges.find(c => c.title === title)) return;
    if (!user) return;

    const completedDate = new Date().toDateString();
    setCompletedChallenges((prev) => [
      ...prev,
      { id: Date.now(), title, description, completedDate, points: pts },
    ]);

    await addPoints(pts);

    // Notify when challenge completed
    try {
      await createChallengeNotification(
        user.uid,
        `${title} Completed! 🎉`,
        `${description} You earned ${pts} points!`
      );
    } catch (error) {
      console.error('Error creating challenge completion notification:', error);
    }

    if (badgeToUnlock) await unlockBadge(badgeToUnlock);
    else await unlockBadge("Fit Foodie Star");
  };

  const logProgress = async (field: "waterIntake" | "mealsLogged") => {
    if (!user) return;

    const dailyRef = doc(db, `users/${user.uid}/dailyChallenges/${todayId}`);
    const weeklyRef = doc(db, `users/${user.uid}/weeklyChallenge/${currentWeek}`);
    const dailySnap = await getDoc(dailyRef);
    const weeklySnap = await getDoc(weeklyRef);

    const dailyData = dailySnap.exists() ? dailySnap.data() : {};
    const weeklyData = weeklySnap.exists() ? weeklySnap.data() : {};

    let newCups = dailyData.waterIntake || 0;
    let newMeals = dailyData.mealsLogged || 0;
    let newWeeklyWater = weeklyData.waterDrank || 0;
    let newWeeklyMeals = weeklyData.mealsLogged || 0;

    // Check if this is the first progress (starting a challenge)
    const isFirstWaterLog = newCups === 0 && field === "waterIntake";
    const isFirstMealLog = newMeals === 0 && field === "mealsLogged";

    if (field === "waterIntake") {
      newCups += 1;
      newWeeklyWater += 1;
      
      // Notify when starting hydration challenge
      if (isFirstWaterLog) {
        try {
          await createChallengeNotification(
            user.uid,
            "Hydration Challenge",
            "You've started your daily hydration challenge! Keep drinking water to reach your goal. 💧"
          );
        } catch (error) {
          console.error('Error creating challenge start notification:', error);
        }
      }
    }
    if (field === "mealsLogged") {
      newMeals += 1;
      newWeeklyMeals += 1;
      
      // Notify when starting meal logging challenge
      if (isFirstMealLog) {
        try {
          await createChallengeNotification(
            user.uid,
            "Meal Logging Challenge",
            "You've started tracking your meals today! Log all 3 meals to complete the challenge. 🍽️"
          );
        } catch (error) {
          console.error('Error creating challenge start notification:', error);
        }
      }
    }

    // Update Firebase
    await updateDoc(dailyRef, { waterIntake: newCups, mealsLogged: newMeals, lastUpdated: serverTimestamp() });
    await updateDoc(weeklyRef, { waterDrank: newWeeklyWater, mealsLogged: newWeeklyMeals });

    // Update local state
    setCupsDrunk(newCups);
    setMealsLogged(newMeals);
    setWeeklyProgressWater(newWeeklyWater);
    setWeeklyProgressMeals(newWeeklyMeals);

    // --- Daily Goals ---
    const dailyGoalsCompleted = {
      hydration: newCups >= dailyWaterGoal,
      meals: newMeals >= DAILY_MEAL_GOAL,
    };

    if (dailyGoalsCompleted.hydration) await addCompleted("Daily Hydration", "Completed daily water goal", 10);
    if (dailyGoalsCompleted.meals) await addCompleted("Meal Logger", "Logged all meals today!", 10);
    if (dailyGoalsCompleted.hydration && dailyGoalsCompleted.meals) {
      await addCompleted("Daily Challenger", "Completed all daily goals!", 25, "Daily Challenger");
    }

    // --- Weekly Goals ---
    if (newWeeklyWater >= WEEKLY_WATER_GOAL) await addCompleted("Weekly Hydration", "Completed weekly hydration goal!", 50, "Hydration Hero");
    if (newWeeklyMeals >= WEEKLY_MEAL_GOAL) await addCompleted("Weekly Meal Challenge", "Logged all meals this week!", 50, "Meal Master");

    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <Layout>
      <div className="challenges-container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="challenges-title text-2xl font-bold">Your Challenges</h1>
            <p className="text-sm text-gray-500">Earn stars by completing goals 🌟</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full font-semibold text-yellow-600">
            <StarIcon size={18} /> {points} pts
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container mb-6 flex gap-3">
          {["active", "completed", "badges"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selectedTab === tab
                  ? tab === "active"
                    ? "bg-blue-600 text-white"
                    : tab === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-purple-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircleIcon size={18} /> Progress Updated!
          </div>
        )}

        {/* Active Challenges */}
        {selectedTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Water */}
            <Card className="p-5 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold  dark:text-white  mb-1 ">Daily Hydration 💧</h3>
              <ProgressBar value={cupsDrunk} max={dailyWaterGoal} color="blue" />
              <p className="text-sm text-gray-600 dark:text-white-300 mt-2">
                {cupsDrunk}/{dailyWaterGoal.toFixed(1)} cups today
              </p>
              <Button onClick={() => logProgress("waterIntake")} disabled={cupsDrunk >= dailyWaterGoal}>
                Drink 1 Cup
              </Button>
            </Card>

            {/* Daily Meals */}
            <Card className="p-5 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold dark:text-white mb-1">Meal Logger 🍽️</h3>
              <ProgressBar value={mealsLogged} max={DAILY_MEAL_GOAL} color="emerald" />
              <p className="text-sm text-gray-600 mt-2">
                {mealsLogged}/{DAILY_MEAL_GOAL} meals logged today
              </p>
              <Button onClick={() => logProgress("mealsLogged")} disabled={mealsLogged >= DAILY_MEAL_GOAL}>
                Log Meal
              </Button>
            </Card>

            {/* Weekly Water */}
            <Card className="md:col-span-2 p-5 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold dark:text-white mb-1">Weekly Hydration Challenge 🏆</h3>
              <ProgressBar value={weeklyProgressWater} max={WEEKLY_WATER_GOAL} color="amber" />
              <p className="text-sm text-gray-600 mt-2">
                {weeklyProgressWater}/{WEEKLY_WATER_GOAL} cups this week
              </p>
            </Card>

            {/* Weekly Meals */}
            <Card className="md:col-span-2 p-5 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold dark:text-white  mb-1">Weekly Meal Challenge 🥗</h3>
              <ProgressBar value={weeklyProgressMeals} max={WEEKLY_MEAL_GOAL} color="emerald" />
              <p className="text-sm text-gray-600 mt-2">
                {weeklyProgressMeals}/{WEEKLY_MEAL_GOAL} meals this week
              </p>
            </Card>
          </div>
        )}

        {/* Completed */}
        {selectedTab === "completed" && (
          <Card className="p-5">
            <h2 className="font-bold text-lg mb-4">Completed Challenges</h2>
            {completedChallenges.length === 0 ? (
              <p className="dark:text-white">No challenges completed yet.</p>
            ) : (
              completedChallenges.map((c) => (
                <div key={c.id} className="flex justify-between mb-2 border-b pb-1 text-sm">
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-gray-500 ">{c.description}</p>
                  </div>
                  <div className="text-gray-400">{c.completedDate} (+{c.points} pts)</div>
                </div>
              ))
            )}
          </Card>
        )}

        {/* Badges */}
        {selectedTab === "badges" && (
          <Card className="p-5">
            <h2 className="font-bold text-lg mb-4">Your Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border shadow-sm flex flex-col items-center ${
                    b.unlocked
                      ? "bg-emerald-50 border-emerald-200 animate-bounce"
                      : "bg-gray-100 border-gray-300 opacity-70"
                  }`}
                >
                  {b.unlocked ? (
                    <div className="text-3xl mb-2">{b.image}</div>
                  ) : (
                    <LockIcon size={24} className="text-gray-400 mb-2" />
                  )}
                  <h3 className="font-semibold text-sm">{b.name}</h3>
                  <p className="text-xs text-gray-500 text-center">{b.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Challenges;
