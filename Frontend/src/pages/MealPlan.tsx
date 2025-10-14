import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ShoppingBagIcon, CheckIcon, CalendarIcon } from 'lucide-react';
const MealPlan: React.FC = () => {
  const [activeDay, setActiveDay] = useState(0);
  const days = ['Today', 'Tomorrow', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
  const mealPlan = [{
    breakfast: {
      title: 'Oats with banana',
      description: 'Oatmeal with sliced banana, one boiled egg, and green tea',
      calories: 310,
      protein: 12,
      completed: true
    },
    lunch: {
      title: 'Chickpea Stir-fry',
      description: 'Chickpea stir-fry with brown rice and vegetables',
      calories: 420,
      protein: 15,
      completed: false
    },
    snack: {
      title: 'Apple & Peanut Butter',
      description: 'Apple slices with 1 tbsp peanut butter',
      calories: 180,
      protein: 5,
      completed: false
    },
    dinner: {
      title: 'Vegetable Curry',
      description: 'Paneer-free vegetable curry with quinoa',
      calories: 380,
      protein: 12,
      completed: false
    }
  }
  // For other days, we'd have similar data
  ];
  // Fill in the rest of the days with placeholder data
  for (let i = 1; i < 7; i++) {
    mealPlan.push(mealPlan[0]);
  }
  return <Layout>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => history.back()} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ChevronLeftIcon size={20} />
          <span className="ml-1">Back to Dashboard</span>
        </button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Meal Plan</h1>
          <Button variant="outline" icon={<div style={{width:16, height:16}} />}>
            Regenerate Plan
          </Button>
        </div>
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {days.map((day, index) => <button key={index} onClick={() => setActiveDay(index)} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${activeDay === index ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {day}
              </button>)}
          </div>
        </div>
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CalendarIcon size={20} className="text-emerald-500" />
              </div>
              <h2 className="ml-3 font-bold text-xl text-gray-800">
                {days[activeDay]}'s Meals
              </h2>
            </div>
            <div className="text-sm text-gray-500">Total: ~1,290 calories</div>
          </div>
          <div className="space-y-6">
            {Object.entries(mealPlan[activeDay]).map(([mealTime, meal], index) => <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${meal.completed ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        {meal.completed ? <CheckIcon size={14} className="text-emerald-500" /> : <span className="text-xs text-gray-500">
                            {index + 1}
                          </span>}
                      </div>
                      <h3 className="ml-2 font-medium text-gray-800 capitalize">
                        {mealTime}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {meal.calories} cal
                    </span>
                  </div>
                  <div className="ml-8">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">
                        {meal.title}
                      </h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {meal.protein}g protein
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {meal.description}
                    </p>
                    <div className="flex space-x-2">
                      {meal.completed ? <Button size="sm" variant="ghost" disabled>
                          Already Logged
                        </Button> : <Button size="sm" variant="outline" icon={<PlusIcon size={14} />}>
                          Log This Meal
                        </Button>}
                      <Button size="sm" variant={meal.completed ? 'ghost' : 'outline'} icon={<div style={{width:14, height:14}} />}>
                        Swap Meal
                      </Button>
                    </div>
                  </div>
                </div>)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-gray-800">
              Nutritional Insights
            </h2>
            <div className="text-sm text-gray-500">Based on your goals</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Daily Targets</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Calories</span>
                    <span className="text-gray-800">1,290 / 2,100 kcal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{
                    width: '61.4%'
                  }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Protein</span>
                    <span className="text-gray-800">44 / 90 g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{
                    width: '48.9%'
                  }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Carbs</span>
                    <span className="text-gray-800">156 / 260 g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{
                    width: '60%'
                  }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Fats</span>
                    <span className="text-gray-800">42 / 70 g</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{
                    width: '60%'
                  }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                AI Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    Add turmeric to dinner—it supports digestion and reduces
                    inflammation
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    Consider having your snack between lunch and dinner when
                    energy typically dips
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    Drink a glass of water before each meal to help with portion
                    control
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>
                    This plan is well-suited for your lactose intolerance and
                    mostly vegetarian preferences
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" icon={<ShoppingBagIcon size={16} />}>
              Add All to Pantry
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" icon={<ChevronLeftIcon size={16} />} onClick={() => setActiveDay(Math.max(0, activeDay - 1))} disabled={activeDay === 0}>
                Previous Day
              </Button>
              <Button icon={<ChevronRightIcon size={16} />} onClick={() => setActiveDay(Math.min(6, activeDay + 1))} disabled={activeDay === 6}>
                Next Day
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>;
};
export default MealPlan;

