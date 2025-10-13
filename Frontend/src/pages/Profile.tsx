import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { UserIcon, EditIcon, TrendingUpIcon, SettingsIcon, CalendarIcon, BarChart3Icon, AwardIcon, ChevronRightIcon, BellIcon } from 'lucide-react';
const Profile: React.FC = () => {
  return <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600">View and manage your account details</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                Ravi Kumar
              </h2>
              <p className="text-gray-600 mb-4">Kandy, Sri Lanka</p>
              <div className="flex space-x-2 mb-6">
                <Button size="sm" variant="outline" icon={<EditIcon size={14} />}>
                  Edit Profile
                </Button>
                <Button size="sm" variant="outline" icon={<SettingsIcon size={14} />}>
                  Settings
                </Button>
              </div>
              <div className="w-full p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-800">
                    May 2023
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Challenge Points
                  </span>
                  <span className="text-sm font-medium text-amber-600">
                    200 pts
                  </span>
                </div>
              </div>
              <div className="w-full">
                <h3 className="font-medium text-gray-800 text-left mb-2">
                  Connected Apps
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Google Fit</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Apple Health</span>
                    <Button size="sm" variant="ghost">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-gray-800">
                Weight Goal Progress
              </h2>
              <Button size="sm" variant="outline" icon={<TrendingUpIcon size={14} />}>
                Track Weight
              </Button>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-sm text-gray-500">Starting</span>
                  <p className="font-medium text-gray-800">75 kg</p>
                </div>
                <div className="text-center">
                  <span className="text-sm text-gray-500">Current</span>
                  <p className="font-medium text-emerald-600">73.2 kg</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Goal</span>
                  <p className="font-medium text-gray-800">72 kg</p>
                </div>
              </div>
              <ProgressBar value={1.8} max={3} color="emerald" className="mb-1" />
              <p className="text-xs text-gray-500 text-right">
                1.8 kg lost • 1.2 kg to go
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">
                Dietary Preferences
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Diet Type</p>
                    <p className="text-sm text-gray-600">Mostly vegetarian</p>
                  </div>
                  <Button size="sm" variant="ghost" icon={<EditIcon size={14} />}>
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      Allergies & Restrictions
                    </p>
                    <p className="text-sm text-gray-600">Lactose intolerance</p>
                  </div>
                  <Button size="sm" variant="ghost" icon={<EditIcon size={14} />}>
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Calorie Target</p>
                    <p className="text-sm text-gray-600">
                      2,100 calories per day
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" icon={<EditIcon size={14} />}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Weekly Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Avg. Calories</span>
                    <CalendarIcon size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">1,850</p>
                  <p className="text-xs text-emerald-600">-12% vs target</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Protein</span>
                    <BarChart3Icon size={14} className="text-blue-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">82g/day</p>
                  <p className="text-xs text-amber-600">-9% vs target</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Water</span>
                    <BarChart3Icon size={14} className="text-amber-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">1.8L/day</p>
                  <p className="text-xs text-red-600">-28% vs target</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Plant Meals</span>
                    <AwardIcon size={14} className="text-purple-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">8 meals</p>
                  <p className="text-xs text-emerald-600">+33% vs last week</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-gray-800">
                Notification Preferences
              </h2>
              <BellIcon size={20} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Daily Reminders</p>
                  <p className="text-sm text-gray-500">
                    Meal logging reminders
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Progress summaries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">Challenge Updates</p>
                  <p className="text-sm text-gray-500">
                    New and completed challenges
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-800">AI Suggestions</p>
                  <p className="text-sm text-gray-500">
                    Personalized nutrition tips
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-lg text-gray-800 mb-4">
              Account Settings
            </h2>
            <div className="space-y-2">
              <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <UserIcon size={16} className="text-gray-500 mr-3" />
                  <span className="font-medium text-gray-800">
                    Personal Information
                  </span>
                </div>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <SettingsIcon size={16} className="text-gray-500 mr-3" />
                  <span className="font-medium text-gray-800">
                    App Preferences
                  </span>
                </div>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <BellIcon size={16} className="text-gray-500 mr-3" />
                  <span className="font-medium text-gray-800">
                    Notifications
                  </span>
                </div>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <CalendarIcon size={16} className="text-gray-500 mr-3" />
                  <span className="font-medium text-gray-800">Export Data</span>
                </div>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="mt-6">
              <Button variant="outline" fullWidth>
                Log Out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>;
};
export default Profile;