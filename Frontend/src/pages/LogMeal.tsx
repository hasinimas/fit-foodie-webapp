import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { MicIcon, SendIcon, CameraIcon, ChevronLeftIcon, CameraOffIcon, BarChart3Icon, InfoIcon, RotateCcwIcon } from 'lucide-react';
const LogMeal: React.FC = () => {
  const [mealInput, setMealInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealInput.trim()) {
      setIsAnalyzing(true);
      // Simulate API call
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 1500);
    }
  };
  const handleVoiceInput = () => {
    // Simulate voice input
    setMealInput('Breakfast: oats with sliced banana, one boiled egg, and green tea.');
  };
  return <Layout>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ChevronLeftIcon size={20} />
          <span className="ml-1">Back to Dashboard</span>
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-7/12">
            <Card>
              <h2 className="font-bold text-xl text-gray-800 mb-6">
                Log Your Meal
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe your meal
                  </label>
                  <div className="relative">
                    <textarea value={mealInput} onChange={e => setMealInput(e.target.value)} placeholder="e.g., Breakfast: oats with sliced banana, one boiled egg, and green tea." rows={4} className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <button type="button" onClick={handleVoiceInput} className="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-emerald-500">
                      <MicIcon size={20} />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Be as detailed as possible for accurate nutrition analysis
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Type
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input type="time" defaultValue="07:30" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
              
                <Button type="submit" fullWidth icon={<SendIcon size={16} />} disabled={isAnalyzing || !mealInput.trim()}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Meal'}
                </Button>
              </form>
            </Card>
            {isAnalyzing && <div className="mt-6 p-8 bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-emerald-500 border-gray-200 rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Analyzing your meal...</p>
                <p className="text-sm text-gray-500 mt-1">
                  This will just take a moment
                </p>
              </div>}
          </div>
          <div className="w-full md:w-5/12">
            {showResults ? <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl text-gray-800">
                    Nutrition Analysis
                  </h2>
                  <Button variant="ghost" size="sm" icon={<RotateCcwIcon size={16} />} onClick={() => {
                setShowResults(false);
                setMealInput('');
              }}>
                    Reset
                  </Button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-2">Your meal:</p>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    Breakfast: oats with sliced banana, one boiled egg, and
                    green tea.
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Calories</p>
                      <BarChart3Icon size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-1">
                      310 kcal
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Protein</p>
                      <BarChart3Icon size={16} className="text-blue-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-1">12g</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Carbs</p>
                      <BarChart3Icon size={16} className="text-amber-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-1">44g</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Fats</p>
                      <BarChart3Icon size={16} className="text-purple-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-1">8g</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Detailed Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600">Saturated Fat</p>
                      <p className="text-sm font-medium text-gray-800">2.1g</p>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600">Fiber</p>
                      <p className="text-sm font-medium text-gray-800">5.2g</p>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600">Sugar</p>
                      <p className="text-sm font-medium text-gray-800">12.4g</p>
                    </div>
                    <div className="flex justify-between py-2">
                      <p className="text-sm text-gray-600">Sodium</p>
                      <p className="text-sm font-medium text-gray-800">68mg</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-6">
                  <div className="flex items-start">
                    <InfoIcon size={18} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      This breakfast provides a good balance of protein and
                      complex carbs. Consider adding some healthy fats like nuts
                      or seeds to make it more filling.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Save to Log
                  </Button>
                  <Button onClick={() => navigate('/meal-plan')}>
                    Generate Meal Plan
                  </Button>
                </div>
              </Card> : <Card>
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3Icon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-xs">
                    Enter your meal details and click "Analyze Meal" to see
                    nutritional information
                  </p>
                  <div className="flex flex-col space-y-2 w-full max-w-xs">
                    <div className="h-2 bg-gray-100 rounded-full w-full" />
                    <div className="h-2 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-2 bg-gray-100 rounded-full w-1/2" />
                  </div>
                </div>
              </Card>}
          </div>
        </div>
      </div>
    </Layout>;
};
export default LogMeal;

