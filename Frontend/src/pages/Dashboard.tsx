import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import navButton from '../components/NavButton';
import ProgressBar from '../components/ProgressBar';
import MoodTracker from '../components/MoodTracker';
import { UtensilsIcon, CalendarIcon, TrophyIcon, PlusIcon, ChevronRightIcon, HeartIcon, ActivityIcon, BarChart3Icon, TrendingUpIcon, DropletIcon, BrainIcon } from 'lucide-react';
import '../styles/Dashboard.css';
// Define types for our data structures
interface UserProgress {
  calories: number;
  protein: number;
  water: number;
  carbs: number;
  fats: number;
  fiber: number;
}
interface UserData {
  name: string;
  goal: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyWater: number;
  progress: UserProgress;
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
// Mock user data - in a real app this would come from Firebase
const userData: UserData = {
  name: 'Ravi',
  goal: 'lose-weight',
  dailyCalories: 2100,
  dailyProtein: 90,
  dailyWater: 2.5,
  progress: {
    calories: 310,
    protein: 12,
    water: 0.5,
    carbs: 44,
    fats: 8,
    fiber: 5
  }
};
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
          quickActions: [{
            label: 'Log Meal',
            icon: <UtensilsIcon size={16} className="text-emerald-500" />,
            path: '/log-meal'
          }, {
            label: 'Track Steps',
            icon: <TrendingUpIcon size={16} className="text-blue-500" />,
            path: '/activity'
          }, {
            label: 'View Challenge',
            icon: <TrophyIcon size={16} className="text-amber-500" />,
            path: '/challenges'
          }]
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
          quickActions: [{
            label: 'Log Meal',
            icon: <UtensilsIcon size={16} className="text-emerald-500" />,
            path: '/log-meal'
          }, {
            label: 'Log Workout',
            icon: <ActivityIcon size={16} className="text-blue-500" />,
            path: '/workouts'
          }, {
            label: 'Protein Foods',
            icon: <TrophyIcon size={16} className="text-amber-500" />,
            path: '/pantry'
          }]
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
          quickActions: [{
            label: 'Log Meal',
            icon: <UtensilsIcon size={16} className="text-emerald-500" />,
            path: '/log-meal'
          }, {
            label: 'Nutrient Report',
            icon: <HeartIcon size={16} className="text-blue-500" />,
            path: '/nutrients'
          }, {
            label: 'View Plan',
            icon: <CalendarIcon size={16} className="text-amber-500" />,
            path: '/meal-plan'
          }]
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
          quickActions: [{
            label: 'Log Meal',
            icon: <UtensilsIcon size={16} className="text-emerald-500" />,
            path: '/log-meal'
          }, {
            label: 'Energy Foods',
            icon: <BrainIcon size={16} className="text-blue-500" />,
            path: '/pantry'
          }, {
            label: 'Track Mood',
            icon: <HeartIcon size={16} className="text-amber-500" />,
            path: '/mood'
          }]
        };
      case 'eat-healthier':
      default:
        return {
          greeting: 'Focus on nutrient-dense foods today',
          primaryMetric: 'Nutrition',
          primaryIcon: <HeartIcon size={24} className="text-emerald-500" />,
          secondaryMetric: 'Vegetables',
          secondaryValue: '3/5 servings',
          secondaryIcon: <DropletIcon size={24} className="text-blue-500" />,
          tip: 'Try to include at least 5 different colored vegetables and fruits today',
          quickActions: [{
            label: 'Log Meal',
            icon: <UtensilsIcon size={16} className="text-emerald-500" />,
            path: '/log-meal'
          }, {
            label: 'Nutrition Report',
            icon: <HeartIcon size={16} className="text-blue-500" />,
            path: '/nutrients'
          }, {
            label: 'Healthy Recipes',
            icon: <CalendarIcon size={16} className="text-amber-500" />,
            path: '/meal-plan'
          }]
        };
    }
  };
  const goalContent = goalSpecificContent();
  const handleMoodSubmit = (mood: string) => {
    setIsLoading(true);
    // Simulate API call to get AI response
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
  return <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome, {userData.name}!</h1>
            <p className="dashboard-subtitle">
              {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}{' '}
              • {goalContent.greeting}
            </p>
          </div>
          <div className="dashboard-action">
            <Button icon={<PlusIcon size={18} />} onClick={() => navigate('/log-meal')}>
              Log Meal
            </Button>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="nutrition-sum">
          <Card className="col-span-1 md:col-span-1">
            <h2 className="nutrition-card-title">Today's Nutrition</h2>
            <div className="nutrition-stats">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon-container stat-icon-primary">
                  {goalContent.primaryIcon}
                </div>
                <div>
                  <p className="stat-label">{goalContent.primaryMetric}</p>
                  <p className="stat-value">
                    {userData.progress.calories} / {userData.dailyCalories}
                  </p>
                </div>
              </div>
              <div className="stat-card stat-card-secondary">
                <div className="stat-icon-container stat-icon-secondary">
                  {goalContent.secondaryIcon}
                </div>
                <div>
                  <p className="stat-label">{goalContent.secondaryMetric}</p>
                  <p className="stat-value">{goalContent.secondaryValue}</p>
                </div>
              </div>
              <div className="stat-card stat-card-tertiary">
                <div className="stat-icon-container stat-icon-tertiary">
                  <DropletIcon size={24} className="text-amber-500" />
                </div>
                <div>
                  <p className="stat-label">Water</p>
                  <p className="stat-value">
                    {userData.progress.water}L / {userData.dailyWater}L
                  </p>
                </div>
              </div>
            </div>
            <div className="tip-box">
              <p className="tip-text">
                <span className="font-medium">Tip:</span> {goalContent.tip}
              </p>
            </div>
            <div className="macro-grid">
              <div className="macro-card">
                <p className="macro-label">Carbs</p>
                <p className="macro-value">{userData.progress.carbs}g / 260g</p>
                <ProgressBar value={userData.progress.carbs} max={260} color="blue" size="md" className="mt-2" />
              </div>
              <div className="macro-card">
                <p className="macro-label">Protein</p>
                <p className="macro-value">
                  {userData.progress.protein}g / {userData.dailyProtein}g
                </p>
                <ProgressBar value={userData.progress.protein} max={userData.dailyProtein} color="emerald" size="md" className="mt-2" />
              </div>
              <div className="macro-card">
                <p className="macro-label">Fats</p>
                <p className="macro-value">{userData.progress.fats}g / 70g</p>
                <ProgressBar value={userData.progress.fats} max={70} color="amber" size="md" className="mt-2" />
              </div>
            </div>  
          </Card>
          </div>
          <Card>
            <h2 className="quick-actions-title">Quick Actions</h2>
            <div className="action-list">
              {goalContent.quickActions.map((action, index) => <button key={index} onClick={() => navigate(action.path)} className="action-button">
                  <div className="flex items-center">
                    <div className="action-icon-container">{action.icon}</div>
                    <span className="action-label">{action.label}</span>
                  </div>
                  <ChevronRightIcon size={16} className="action-arrow" />
                </button>)}
            </div>
            <div className="challenge-card">
              <div className="challenge-header">
                <h3 className="challenge-title">Active Challenge</h3>
                <span className="challenge-badge">In Progress</span>
              </div>
              <p className="challenge-description">
                {userData.goal === 'lose-weight' && 'Track all meals for 5 days straight'}
                {userData.goal === 'gain-muscle' && 'Hit your protein goal for 5 days'}
                {userData.goal === 'maintain-weight' && 'Maintain calorie balance for 7 days'}
                {userData.goal === 'improve-energy' && 'Drink 2.5L water for 5 days'}
                {userData.goal === 'eat-healthier' && 'Eat 5 servings of vegetables for 3 days'}
              </p>
              <ProgressBar value={2} max={5} color="amber" />
              <div className="challenge-footer">
                <span className="challenge-days">3 days remaining</span>
                <Button variant="outline" size="sm" onClick={() => navigate('/challenges')}>           
                  View Challenge
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <div className="dashboard-grid">
          <div className="md:col-span-2">
            <MoodTracker onSubmitMood={handleMoodSubmit} aiResponse={aiResponse} isLoading={isLoading} />
          </div>
          <Card>
            <h2 className="quick-actions-title">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    {userData.goal === 'lose-weight' && 'Weight Loss'}
                    {userData.goal === 'gain-muscle' && 'Muscle Gain'}
                    {userData.goal === 'maintain-weight' && 'Consistency'}
                    {userData.goal === 'improve-energy' && 'Energy Level'}
                    {userData.goal === 'eat-healthier' && 'Nutrition Score'}
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    +12%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-emerald-500 rounded-full" style={{
                  width: '45%'
                }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Streak</span>
                  <span className="text-sm font-medium text-emerald-600">
                    5 days
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7].map(day => <div key={day} className={`h-8 flex-1 rounded ${day <= 5 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>)}
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="lg" fullWidth icon={<TrendingUpIcon size={16} />} onClick={() => navigate('/profile')}>
                  View Full Progress
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <Card>
          <h2 className="nutrition-card-title">Meal History</h2>
          <div className="overflow-x-auto">
            <table className="meal-table">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell">Time</th>
                  <th className="table-header-cell">Meal</th>
                  <th className="table-header-cell">Calories</th>
                  <th className="table-header-cell">Protein</th>
                  <th className="table-header-cell">Carbs</th>
                  <th className="table-header-cell">Fats</th>
                </tr>
              </thead>
              <tbody>
                <tr className="table-body-row">
                  <td className="table-cell">7:30 AM</td>
                  <td className="table-cell">
                    Oats with banana, boiled egg, green tea
                  </td>
                  <td className="table-cell">310 kcal</td>
                  <td className="table-cell">12g</td>
                  <td className="table-cell">44g</td>
                  <td className="table-cell">8g</td>
                </tr>
                <tr>
                  <td colSpan={6} className="table-empty">
                    No other meals logged today
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>;
};
export default Dashboard;

