import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useTheme } from '../components/ThemeContext';
import UpgradeToPremium from '../components/UpgradeToPremium';
// @ts-ignore - firebaseConfig is a .js file
import { db, auth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import { ChevronLeftIcon, MoonIcon, SunIcon, GlobeIcon, BellIcon, ShieldIcon, TrashIcon, SaveIcon, CheckIcon } from 'lucide-react';
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('english');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    checkUserPlan();
    
    // Poll for plan changes every 2 seconds to auto-refresh when premium is cancelled/upgraded
    const interval = setInterval(() => {
      checkUserPlan();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const checkUserPlan = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userPlan = userData.plan || 'free';
        setIsPremium(userPlan === 'premium');
      }
    } catch (error) {
      console.error('Error checking user plan:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };
  return <Layout>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => history.back()}

        className="flex items-center text-gray-600 dark:text-gray-300  hover:text-gray-800dark:hover:text-gray-100 mb-6">

          <ChevronLeftIcon size={20} />
          <span className="ml-1">Back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 dark:text-white 500 mb-6">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
 <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">              <div className="p-4 border-b border-gray-100">
                <h2 className="font-medium text-gray-800 dark:text-white 500 ">Settings</h2>
              </div>
              <div className="p-2">
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${activeTab === 'general' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100 '}`} onClick={() => setActiveTab('general')}>
                  General
                </button>
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${activeTab === 'notifications' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('notifications')}>
                  Notifications
                </button>
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${activeTab === 'privacy' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('privacy')}>
                  Privacy & Security
                </button>
                <button className={`w-full text-left px-4 py-2 rounded-lg text-sm ${activeTab === 'account' ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab('account')}>
                  Account
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            {activeTab === 'general' && <Card>
               <h2 className="font-bold text-lg text-gray-800 dark:text-white dark:text-white 500 mb-6">
  General Settings
</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-3">
  Appearance
</h3>
                    <div className="flex space-x-2">
                     
                      <button onClick={() => setTheme('light')} className={`flex-1 p-3 border rounded-lg flex flex-col items-center ${theme === 'light' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${theme === 'light' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                          <SunIcon size={20} className={theme === 'light' ? 'text-emerald-500' : 'text-gray-400'  } />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-white">Light</span>
                      </button>
                      <button onClick={() => setTheme('dark')} className={`flex-1 p-3 border rounded-lg flex flex-col items-center ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${theme === 'dark' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                          <MoonIcon size={20} className={theme === 'dark' ? 'text-emerald-500' : 'text-gray-400'} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray" >Dark</span>
                      </button>
                      <button onClick={() => setTheme('system')} className={`flex-1 p-3 border rounded-lg flex flex-col items-center ${theme === 'system' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${theme === 'system' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                          <div className="w-5 h-5 bg-gray-400 rounded-full relative">
                            <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray">System</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white 500 mb-3">Language</h3>
                    <div className="flex items-center space-x-3 mb-2">
                      <GlobeIcon size={20} className="text-gray-400" />
                      <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        <option value="english">English</option>
                        <option value="tamil">Tamil</option>
                        <option value="sinhala">Sinhala</option>
                        <option value="hindi">Hindi</option>
                      </select>
                    </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
  This will change the language throughout the app
</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white 500 mb-3">
                      Units of Measurement
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-white 500 ">Weight</span>
                        <div className="flex">
                          <button className="px-3 py-1 bg-emerald-500 text-white rounded-l-md text-sm">
                            kg
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-r-md text-sm">
                            lb
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-white 500">Volume</span>
                        <div className="flex">
                          <button className="px-3 py-1 bg-emerald-500 text-white rounded-l-md text-sm">
                            ml
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-r-md text-sm">
                            oz
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-white 500 ">Energy</span>
                        <div className="flex">
                          <button className="px-3 py-1 bg-emerald-500 text-white rounded-l-md text-sm">
                            kcal
                          </button>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-r-md text-sm">
                            kJ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
                  </div>
                </div>
              </Card>}
            {activeTab === 'notifications' && <Card>
                <div className="flex items-center justify-between mb-6">
                  
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white ">

                    Notification Settings
                  </h2>
                  <BellIcon size={20} className="text-gray-400 dark:text-white" />
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                      Notification Methods
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white ">
                            Email
                          </p>
                          <p className="text-xs text-gray-500 dark:text-white ">
                            ravi.kumar@example.com
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white ">
                            In-App
                          </p>
                          <p className="text-xs text-gray-500 dark:text-white ">
                            Push notifications in the app
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                      Notification Types
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white">
                            Meal Reminders
                          </p>
                          <p className="text-xs text-gray-500">
                            Daily reminders to log your meals
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white">
                            Weekly Reports
                          </p>
                          <p className="text-xs text-gray-500">
                            Weekly nutrition summary
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white ">
                            Challenge Updates
                          </p>
                          <p className="text-xs text-gray-500">
                            Progress and completion alerts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white ">
                            AI Insights
                          </p>
                          <p className="text-xs text-gray-500">
                            Personalized nutrition tips
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
                  </div>
                </div>
              </Card>}
            {activeTab === 'privacy' && <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white ">
                    Privacy & Security
                  </h2>
                  <ShieldIcon size={20} className="text-gray-400" />
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white  mb-3">
                      Data Usage
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white ">
                            Share Usage Data
                          </p>
                          <p className="text-xs text-gray-500">
                            Help improve Fit Foodie with anonymous data
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-white ">
                            Personalized AI
                          </p>
                          <p className="text-xs text-gray-500">
                            Allow AI to analyze your nutrition data
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Security</h3>
                    <div className="space-y-4">
                      <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            Change Password
                          </p>
                          <p className="text-xs text-gray-500">
                            Update your account password
                          </p>
                        </div>
                        <ChevronLeftIcon size={16} className="transform rotate-180 text-gray-400" />
                      </button>
                      <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            Two-Factor Authentication
                          </p>
                          <p className="text-xs text-gray-500">
                            Add an extra layer of security
                          </p>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Disabled
                        </span>
                      </button>
                      <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            Connected Devices
                          </p>
                          <p className="text-xs text-gray-500">
                            Manage devices with access to your account
                          </p>
                        </div>
                        <ChevronLeftIcon size={16} className="transform rotate-180 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                      Data Management
                    </h3>
                    <div className="space-y-4">
                      <button className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            Export Your Data
                          </p>
                          <p className="text-xs text-gray-500">
                            Download all your nutrition and activity data
                          </p>
                        </div>
                        <ChevronLeftIcon size={16} className="transform rotate-180 text-gray-400" />
                      </button>
                      <button className="w-full flex justify-between items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left">
                        <div>
                          <p className="text-sm font-medium text-red-600">
                            Delete All Data
                          </p>
                          <p className="text-xs text-red-500">
                            Remove all your personal data from our servers
                          </p>
                        </div>
                        <TrashIcon size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
                  </div>
                </div>
              </Card>}
            {activeTab === 'account' && <Card>
                <h2 className="font-bold text-lg text-gray-800  dark:text-white mb-6">
                  Account Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                          Full Name
                        </label>
                        <input type="text" defaultValue="Ravi Kumar" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700  dark:text-white mb-1">
                          Email Address
                        </label>
                        <input type="email" defaultValue="ravi.kumar@example.com" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                          Phone Number (optional)
                        </label>
                        <input type="tel" placeholder="+94 123 456 789" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                          Location
                        </label>
                        <input type="text" defaultValue="Kandy, Sri Lanka" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      Subscription
                    </h3>
                    {loading ? (
                      <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Loading subscription info...</p>
                      </div>
                    ) : isPremium ? (
                      <div className="p-4 border border-emerald-100 bg-emerald-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                            <CheckIcon size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Premium Plan</p>
                            <p className="text-sm text-gray-600 mt-1">
                              You're on the Premium plan with access to all advanced features and unlimited meal planning.
                            </p>
                            <UpgradeToPremium />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-emerald-100 bg-emerald-50 rounded-lg">
                        <div className="flex items-start">
                          <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <CheckIcon size={14} className="text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Free Plan</p>
                            <p className="text-sm text-gray-600 mt-1">
                              You're currently on the Free plan with basic
                              features. Upgrade to Premium for advanced AI
                              features and unlimited meal planning.
                            </p>
                            <UpgradeToPremium />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      Danger Zone
                    </h3>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-600 mb-2">
                        Delete Account
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                      <Button variant="outline" size="sm" icon={<TrashIcon size={14} />}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button icon={<SaveIcon size={16} />}>Save Changes</Button>
                  </div>
                </div>
              </Card>}
          </div>
        </div>
      </div>
    </Layout>;
};
export default Settings;