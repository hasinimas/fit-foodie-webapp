import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
// @ts-ignore - firebaseConfig is a .js file
import { db } from '../firebaseConfig';

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'challenge' | 'reminder' | 'achievement' | 'meal' | 'info';
  read?: boolean;
}

/**
 * Create a new notification for a user
 * Adds the notification to the user's notifications array
 */
export const createNotification = async (notificationData: NotificationData) => {
  try {
    const { userId, ...notificationContent } = notificationData;
    
    // Create notification object with unique ID
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...notificationContent,
      read: notificationData.read || false,
      createdAt: Timestamp.now(), // Use Timestamp.now() instead of serverTimestamp()
    };

    // Add notification to user's notifications array
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      notifications: arrayUnion(notification)
    });
    
    console.log('Notification created successfully');
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create a meal logging reminder notification
 */
export const createMealReminderNotification = async (userId: string, mealType: string) => {
  return createNotification({
    userId,
    title: 'Meal Reminder',
    message: `Don't forget to log your ${mealType} today!`,
    type: 'reminder',
  });
};

/**
 * Create a challenge progress notification
 */
export const createChallengeNotification = async (
  userId: string,
  challengeName: string,
  progress: string
) => {
  return createNotification({
    userId,
    title: 'Challenge Progress',
    message: `${challengeName}: ${progress}`,
    type: 'challenge',
  });
};

/**
 * Create an achievement notification
 */
export const createAchievementNotification = async (
  userId: string,
  achievementName: string
) => {
  return createNotification({
    userId,
    title: 'Achievement Unlocked!',
    message: `Congratulations! You've earned the "${achievementName}" badge!`,
    type: 'achievement',
  });
};

/**
 * Create a meal logged notification
 */
export const createMealLoggedNotification = async (
  userId: string,
  mealName: string,
  calories: number
) => {
  return createNotification({
    userId,
    title: 'Meal Logged',
    message: `${mealName} logged successfully! (${calories} calories)`,
    type: 'meal',
  });
};

/**
 * Create a premium upgrade notification
 */
export const createPremiumUpgradeNotification = async (userId: string) => {
  return createNotification({
    userId,
    title: 'Welcome to Premium!',
    message: 'Your premium subscription is now active. Enjoy all the exclusive features!',
    type: 'achievement',
  });
};

/**
 * Create a subscription expiry warning notification
 */
export const createSubscriptionExpiryWarning = async (userId: string, daysLeft: number) => {
  return createNotification({
    userId,
    title: 'Subscription Expiring Soon',
    message: `Your premium subscription expires in ${daysLeft} days. Renew to keep your benefits!`,
    type: 'info',
  });
};
