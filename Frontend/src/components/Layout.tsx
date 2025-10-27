import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UtensilsIcon, CalendarIcon, ShoppingBagIcon, TrophyIcon, UserIcon, SettingsIcon, MenuIcon, XIcon } from 'lucide-react';
import NotificationBell from './NotificationBell';
import '../styles/Layout.css';
import { useEffect} from 'react';
// @ts-ignore - firebaseConfig is a .js file
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
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

  // Real-time notifications from user document
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Set up real-time listener for user's notifications from user document
    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userNotifications = userData.notifications || [];
        
        // Sort by createdAt descending (newest first)
        const sortedNotifications = userNotifications
          .map((notif: any, index: number) => ({
            ...notif,
            id: notif.id || `notif-${index}`,
            time: formatTime(notif.createdAt)
          }))
          .sort((a: any, b: any) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return timeB - timeA;
          });
        
        console.log('Notifications updated:', sortedNotifications);
        setNotifications(sortedNotifications);
      }
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe();
  }, []);

  // Format timestamp to relative time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      console.log('Marking notification as read:', id);
      
      // Find the notification in the array
      const notificationToUpdate = notifications.find(n => n.id === id);
      if (!notificationToUpdate) {
        console.error('Notification not found:', id);
        return;
      }

      // Create updated notifications array with the read flag set to true
      const updatedNotifications = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );

      // Update user document with modified notifications array
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        notifications: updatedNotifications
      });
      
      console.log('Successfully marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Clear all notifications by setting empty array
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        notifications: []
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
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
            {navItems.map(item => {
  const isPantry = item.path === "/pantry";
  const isLocked = isPantry && userPlan === "Free";

  return (
    <li
      key={item.path}
      className={`nav-item ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLocked ? (
        <div
          className="nav-link flex items-center"
          title="Available only for Premium users"
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label} 🔒
        </div>
      ) : (
        <Link
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </Link>
      )}
    </li>
  );
})}

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