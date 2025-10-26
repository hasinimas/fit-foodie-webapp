import React from 'react';
// @ts-ignore - firebaseConfig is a .js file
import { auth } from '../firebaseConfig';
import { 
  createNotification, 
  createMealReminderNotification,
  createChallengeNotification,
  createAchievementNotification,
  createMealLoggedNotification,
  createSubscriptionExpiryWarning
} from '../services/notificationService';
import Button from './Button';

/**
 * NotificationTester - A component to test different notification types
 * This is useful for development and testing the notification system
 */
const NotificationTester: React.FC = () => {
  const handleTestNotification = async (type: string) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to test notifications');
      return;
    }

    try {
      switch (type) {
        case 'meal-reminder':
          await createMealReminderNotification(user.uid, 'lunch');
          break;
        case 'challenge':
          await createChallengeNotification(user.uid, 'Hydration Hero', "You're 50% complete!");
          break;
        case 'achievement':
          await createAchievementNotification(user.uid, '7-Day Streak');
          break;
        case 'meal-logged':
          await createMealLoggedNotification(user.uid, 'Grilled Chicken Salad', 450);
          break;
        case 'subscription-expiry':
          await createSubscriptionExpiryWarning(user.uid, 3);
          break;
        case 'custom':
          await createNotification({
            userId: user.uid,
            title: 'Custom Test Notification',
            message: 'This is a custom test notification created at ' + new Date().toLocaleTimeString(),
            type: 'info',
          });
          break;
        default:
          break;
      }
      console.log(`✅ ${type} notification created successfully`);
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification. Check console for details.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        🔔 Notification Tester
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Click any button below to create a test notification. Check the notification bell to see it appear!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          onClick={() => handleTestNotification('meal-reminder')}
          variant="secondary"
        >
          🍽️ Meal Reminder
        </Button>
        <Button 
          onClick={() => handleTestNotification('challenge')}
          variant="secondary"
        >
          🏆 Challenge Progress
        </Button>
        <Button 
          onClick={() => handleTestNotification('achievement')}
          variant="secondary"
        >
          🎯 Achievement
        </Button>
        <Button 
          onClick={() => handleTestNotification('meal-logged')}
          variant="secondary"
        >
          ✅ Meal Logged
        </Button>
        <Button 
          onClick={() => handleTestNotification('subscription-expiry')}
          variant="secondary"
        >
          ⏰ Subscription Warning
        </Button>
        <Button 
          onClick={() => handleTestNotification('custom')}
          variant="secondary"
        >
          📣 Custom Notification
        </Button>
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          💡 <strong>Tip:</strong> These notifications will appear in real-time in your notification bell. 
          You can mark them as read by clicking on them or clear all at once.
        </p>
      </div>
    </div>
  );
};

export default NotificationTester;
