import React, { useState } from 'react';
import { BellIcon } from 'lucide-react';
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'challenge' | 'reminder' | 'achievement' |  string;
  time: string;
  read: boolean;
}
interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}
const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications = [],
  onMarkAsRead,
  onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  console.log('NotificationBell - Total notifications:', notifications.length);
  console.log('NotificationBell - Unread count:', unreadCount);
  console.log('NotificationBell - Notifications:', notifications);
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      onClearAll();
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    console.log('Clicking notification:', id);
    onMarkAsRead(id);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
            🏆
          </div>;
      case 'reminder':
        return <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
            ⏰
          </div>;
      case 'achievement':
        return <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
            🎯
          </div>;
      default:
        return <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
            📣
          </div>;
    }
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none">
        <BellIcon size={20} />
        {unreadCount > 0 && <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>}
      </button>
      {isOpen && <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-200">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Notifications</h3>
              {notifications.length > 0 && <button onClick={handleClearAll} className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                  Clear all
                </button>}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div> : <div>
                  {notifications.map(notification => <div key={notification.id} className={`p-3 border-b border-gray-100 flex items-start cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`} onClick={() => handleMarkAsRead(notification.id)}>
                      {getTypeIcon(notification.type)}
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm text-gray-800">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {notification.message}
                        </p>
                      </div>
                    </div>)}
                </div>}
            </div>
            {notifications.length > 0 && <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
                <button className="text-xs text-emerald-600 hover:text-emerald-700" onClick={() => setIsOpen(false)}>
                  Close
                </button>
              </div>}
          </div>
        </>}
    </div>;
};
export default NotificationBell;