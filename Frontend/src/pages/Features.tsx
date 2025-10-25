import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { UtensilsIcon, BrainIcon, ShoppingBagIcon, TrophyIcon, BarChartIcon, CalendarIcon, MessageCircleIcon, ActivityIcon, UserIcon, HeartIcon, LockIcon, ZapIcon, CheckIcon, ArrowRightIcon, Mic } from 'lucide-react';
const Features: React.FC = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Nutritional Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover all the tools and capabilities that make Fit Foodie the
              most comprehensive AI-powered nutritional ecosystem.
            </p>
          </div>
        </div>
      </section>
      {/* Core Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you track, plan, and
              optimize your nutrition with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <UtensilsIcon size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Meal Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Log meals with text or voice, . Our AI instantly
                calculates nutritional values and provides feedback.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Photo recognition for quick logging
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Voice input support</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Detailed nutritional breakdown
                  </span>
                </li>
              </ul>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <BrainIcon size={28} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI Nutritional Coach
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized recommendations, meal alternatives, and
                insights based on your preferences and goals.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Personalized meal suggestions
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Adaptive learning from your preferences
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Nutritional improvement tips
                  </span>
                </li>
              </ul>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <ShoppingBagIcon size={28} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Pantry
              </h3>
              <p className="text-gray-600 mb-4">
                Track groceries, get shopping suggestions, and find recipes
                based on what you already have.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Inventory management</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Expiration date tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Smart shopping lists</span>
                </li>
              </ul>
            </div>
            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <TrophyIcon size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Challenges & Rewards
              </h3>
              <p className="text-gray-600 mb-4">
                Stay motivated with personalized challenges, earn points, and
                unlock achievements as you progress.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Weekly nutrition challenges
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Achievement system</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Community leaderboards</span>
                </li>
              </ul>
            </div>
            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChartIcon size={28} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Progress Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Visualize your journey with intuitive charts and detailed
                insights on your nutritional patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Visual nutrition analytics
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Progress toward goals tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Customizable reporting</span>
                </li>
              </ul>
            </div>
            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <CalendarIcon size={28} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Meal Planning
              </h3>
              <p className="text-gray-600 mb-4">
                Get AI-generated meal plans tailored to your dietary
                preferences, restrictions, and nutritional goals.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Weekly meal planning</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Recipe suggestions</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Grocery list generation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Advanced Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take your nutritional journey to the next level with our premium
              features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Mic size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Voice Meal Log
                </h3>
                <p className="text-gray-600">
                 Log your meals effortlessly using voice commands. Speak naturally to record what you’ve eaten, and the system instantly analyses nutritional data through AI — no typing required. This feature saves time and makes daily tracking seamless and hands-free.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex">
              <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <CalendarIcon size={24} className="text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Weekly Meal Planning
                </h3>
                <p className="text-gray-600">
                  Receive AI-generated weekly meal plans tailored to your goals, preferences, and dietary habits. Users can view daily meal schedules, substitute ingredients, and download personalized plans to stay organized and consistent with their nutrition goals.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <BarChartIcon size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600">
                 Unlock deeper insights into your eating patterns with detailed nutrition analytics. Visual charts and progress summaries display calorie intake, macronutrient distribution, and goal achievements. This data helps users make informed adjustments for better health outcomes.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <TrophyIcon size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Challenges
                </h3>
                <p className="text-gray-600">
                  Stay motivated through gamified wellness challenges. Earn points, badges, and rankings by completing daily or weekly goals such as logging meals or maintaining balanced nutrition. This feature turns healthy habits into fun, achievable milestones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Feature Comparison */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how our different plans compare to find the right fit for your
              needs.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-gray-600 font-medium">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-center text-gray-600 font-medium">
                    Free
                  </th>
                  <th className="py-4 px-6 text-center text-gray-600 font-medium">
                    Premium
                  </th>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-800">
                    Basic Meal Tracking
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                  
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Voice Meal Log</td>
                   <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                  
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">
                    Basic AI Recommendations
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                  
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">
                    Weekly Meal Planning
                  </td>
                  <td className="py-4 px-6 text-center">Limited</td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                 
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">
                    Advanced Analytics
                  </td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>
                
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">
                    Nutritionist Consultations
                  </td>
                  <td className="py-4 px-6 text-center">—</td>
                  <td className="py-4 px-6 text-center">1/month</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800">Challenges</td>
                  <td className="py-4 px-6 text-center">—</td>
<td className="py-4 px-6 text-center">
                    <CheckIcon size={20} className="text-emerald-500 mx-auto" />
                  </td>                 
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Start your journey to better health with Fit Foodie's powerful
            features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button size="lg" variant="secondary" icon={<ArrowRightIcon size={18} />}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-emerald-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FF</span>
                </div>
                <h1 className="ml-2 text-xl font-bold text-white">
                  Fit Foodie
                </h1>
              </div>
              <p className="text-gray-400 mb-4">
                Your AI-powered nutritional ecosystem for healthier living.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Fit Foodie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Features;

