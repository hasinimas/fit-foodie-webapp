import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
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

export function App() {
  return <Router>
    <ThemeProvider>
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log-meal" element={<LogMeal />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-process" element={<PaymentProcess />} />
        </Routes>
      </div>
      </ThemeProvider>
    </Router>;
}