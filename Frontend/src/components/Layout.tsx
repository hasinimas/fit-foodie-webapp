import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UtensilsIcon, CalendarIcon, ShoppingBagIcon, TrophyIcon, UserIcon, SettingsIcon, MenuIcon, XIcon, BellIcon } from 'lucide-react';
import NotificationBell from './NotificationBell';
import '../styles/Layout.css';
import { useEffect} from 'react';
// @ts-ignore - firebaseConfig is a .js file
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}
const Layout: React.FC<LayoutProps> = ({
  children,
  hideNavigation = false
}) => {
  const [currentUserName, setCurrentUserName] = useState("Guest");
  const [userPlan, setUserPlan] = useState("Free");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserName(user.displayName || user.email || "User");
        
        // Fetch user plan from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const plan = userData.plan || 'free';
            setUserPlan(plan === 'premium' ? 'Premium' : 'Free');
          }
        } catch (error) {
          console.error('Error fetching user plan:', error);
          setUserPlan('Free');
        }
      }
    };
    
    fetchUserData();
    
    // Set up an interval to check for plan updates every 3 seconds
    const intervalId = setInterval(fetchUserData, 3000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [location.pathname]); // Re-fetch when route changes
  // Mock notifications data
  const [notifications, setNotifications] = useState([{
    id: '1',
    title: 'Challenge Progress',
    message: "You're halfway through your Hydration Hero challenge!",
    type: 'challenge',
    time: '2h ago',
    read: false
  }, {
    id: '2',
    title: 'Meal Reminder',
    message: "Don't forget to log your lunch today",
    type: 'reminder',
    time: '5h ago',
    read: false
  }, {
    id: '3',
    title: 'New Badge Unlocked',
    message: "You've earned the Newbie badge!",
    type: 'achievement',
    time: '1d ago',
    read: true
  }]);
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => notif.id === id ? {
      ...notif,
      read: true
    } : notif));
  };
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  const navItems = [{
    path: '/dashboard',
    icon: <HomeIcon size={25} />,
    label: 'Dashboard'
  }, {
    path: '/log-meal',
    icon: <UtensilsIcon size={25} />,
    label: 'Log Meal'
  }, {
    path: '/meal-plan',
    icon: <CalendarIcon size={25} />,
    label: 'Meal Plan'
  }, {
    path: '/pantry',
    icon: <ShoppingBagIcon size={25} />,
    label: 'Pantry'
  }, {
    path: '/challenges',
    icon: <TrophyIcon size={25} />,
    label: 'Challenges'
  }, {
    path: '/profile',
    icon: <UserIcon size={25} />,
    label: 'Profile'
  }, {
    path: '/settings',
    icon: <SettingsIcon size={25} />,
    label: 'Settings'
  }];
  if (hideNavigation) {
    return <main className="w-full min-h-screen">{children}</main>;
  }
  return <div className="layout-container">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <span className="text-white font-bold text-lg">FF</span>
          </div>
          <h1 className="logo-text">Fit Foodie</h1>
        </div>
        <nav className="nav-list">
          <ul className="space-y-1">
            {navItems.map(item => <li key={item.path} className="nav-item">
                <Link to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>)}
          </ul>
        </nav>
        <div className="user-profile">
          <div className="user-info">
            <div className="user-avatar">
              <UserIcon size={16} className="text-blue-600" />
            </div>
            <div className="user-details">
              <p className="user-name">{currentUserName}</p>
              <p className="user-plan">{userPlan} Plan</p>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">
            <span className="text-white font-bold text-lg">FF</span>
          </div>
          <h1 className="logo-text">Fit Foodie</h1>
        </div>
        <div className="mobile-actions">
          <NotificationBell notifications={notifications} onMarkAsRead={markAsRead} onClearAll={clearAllNotifications} />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 focus:outline-none">
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <ul>
            {navItems.map(item => <li key={item.path}>
                <Link to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>)}
          </ul>
          <div className="mobile-user-info">
            <div className="user-avatar">
              <UserIcon size={16} className="text-blue-600" />
            </div>
            <div className="user-details">
              <p className="user-name">{currentUserName}</p>
              <p className="user-plan">{userPlan} Plan</p>
            </div>
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <main className="main-content">
        <div className="desktop-header">
          <NotificationBell notifications={notifications} onMarkAsRead={markAsRead} onClearAll={clearAllNotifications} />
        </div>
        {children}
      </main>
    </div>;
};
export default Layout;