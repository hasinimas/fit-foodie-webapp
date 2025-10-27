import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import MealPlan from './pages/MealPlan';
import Pantry from './pages/Pantry';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Features from './pages/Features';
import About from './pages/About';
import Pricing from './pages/Pricing';
import PaymentProcess from './pages/PaymentProcess';
import PaymentSuccess from './pages/PaymentSuccess';
import Reports from './pages/Reports';
import AdminReports from './pages/AdminReports';

export function App() {
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const plan = userDoc.data().plan || 'free';
          setUserPlan(plan.toLowerCase() === 'premium' ? 'Premium' : 'Free');
        } else {
          setUserPlan('Free');
        }
      } else {
        setUserPlan('Free');
      }
      setLoading(false);
    };

    fetchUserPlan();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-700">Loading...</div>;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/log-meal" element={<LogMeal />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route
              path="/pantry"
              element={
                userPlan === "Premium" ? (
                  <Pantry />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route path="/challenges" element={<Challenges />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/payment-process" element={<PaymentProcess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/admin" element={<AdminReports />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}
