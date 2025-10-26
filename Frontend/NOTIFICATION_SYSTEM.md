# Notification System Documentation

## Overview
The Fit Foodie notification system is a real-time, Firebase-powered notification feature that keeps users informed about their activities, achievements, and reminders.

## Architecture

### Frontend Components
- **NotificationBell.tsx**: UI component displaying notifications with a bell icon and dropdown
- **Layout.tsx**: Integrates the notification bell and manages real-time listeners
- **notificationService.ts**: Service for creating different types of notifications

### Firebase Structure
Notifications are stored in Firestore under the `notifications` collection with the following schema:

```javascript
{
  userId: string,           // User's Firebase Auth UID
  title: string,            // Notification title
  message: string,          // Notification message content
  type: string,             // Type: 'challenge' | 'reminder' | 'achievement' | 'meal' | 'info'
  read: boolean,            // Whether the notification has been read
  createdAt: Timestamp      // Server timestamp when notification was created
}
```

## Features

### 1. Real-time Updates
- Uses Firestore `onSnapshot` listener for instant notification updates
- No page refresh required
- Automatically syncs across all user devices

### 2. Notification Types
- **Challenge**: Progress updates on active challenges
- **Reminder**: Meal logging reminders
- **Achievement**: Badge unlocks and milestones
- **Meal**: Confirmation when meals are logged
- **Info**: General information and subscription alerts

### 3. User Actions
- **Mark as Read**: Click any notification to mark it as read
- **Clear All**: Remove all notifications at once
- **Auto-dismiss**: Notifications can be manually dismissed

## Usage

### Creating Notifications

Import the notification service:
```typescript
import { createNotification } from '../services/notificationService';
```

#### Basic Notification
```typescript
await createNotification({
  userId: user.uid,
  title: 'Custom Title',
  message: 'Your message here',
  type: 'info'
});
```

#### Pre-built Notification Functions

**Premium Upgrade**
```typescript
await createPremiumUpgradeNotification(userId);
```

**Meal Logged**
```typescript
await createMealLoggedNotification(userId, mealName, calories);
```

**Challenge Progress**
```typescript
await createChallengeNotification(userId, challengeName, progress);
```

**Achievement Unlocked**
```typescript
await createAchievementNotification(userId, achievementName);
```

**Meal Reminder**
```typescript
await createMealReminderNotification(userId, mealType);
```

**Subscription Expiry Warning**
```typescript
await createSubscriptionExpiryWarning(userId, daysLeft);
```

## Firebase Security Rules

Add these rules to your Firestore security rules:

```javascript
match /notifications/{notificationId} {
  // Users can only read their own notifications
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  
  // Users can write their own notifications (for self-notifications)
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  
  // Users can update (mark as read) and delete their own notifications
  allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

## Integration Points

### Current Integrations
1. **PaymentSuccess.tsx**: Creates notification when user upgrades to premium
2. **LogMeal.tsx**: Creates notification when user logs a meal
3. **Layout.tsx**: Displays notification bell with real-time updates

### Suggested Future Integrations
1. **Challenges.tsx**: Notify when challenges are completed or milestones reached
2. **MealPlan.tsx**: Notify when meal plan is generated
3. **Profile.tsx**: Notify when profile milestones are achieved
4. **UpgradeToPremium.tsx**: Notify before subscription expires

## UI Features

### Desktop View
- Bell icon in top-right header
- Badge showing unread count
- Dropdown panel with notifications list
- Click notification to mark as read
- "Clear all" button to remove all notifications

### Mobile View
- Bell icon in mobile header
- Same functionality as desktop
- Responsive design

### Visual Indicators
- 🏆 Trophy for challenge notifications
- ⏰ Clock for reminders
- 🎯 Target for achievements
- 📣 Megaphone for general info
- Blue background for unread notifications

## Best Practices

1. **Error Handling**: Wrap notification creation in try-catch blocks
2. **User Context**: Always verify user is authenticated before creating notifications
3. **Relevant Messages**: Keep notification messages concise and actionable
4. **Type Selection**: Use appropriate notification types for better UX
5. **Cleanup**: Firestore listeners are automatically cleaned up on component unmount

## Performance Considerations

- Notifications are queried with `.orderBy('createdAt', 'desc')` to show newest first
- Firestore query includes `.where('userId', '==', user.uid)` to fetch only user's notifications
- Real-time listener uses snapshot listener which is efficient for real-time updates
- Consider implementing pagination if user has many notifications (>50)

## Future Enhancements

1. **Push Notifications**: Integrate Firebase Cloud Messaging for browser push notifications
2. **Notification Preferences**: Allow users to customize which notifications they receive
3. **Email Notifications**: Send important notifications via email
4. **Notification History**: Archive old notifications instead of deleting
5. **Notification Groups**: Group similar notifications together
6. **Schedule Notifications**: Create scheduled notifications for meal reminders
7. **Rich Notifications**: Add images, action buttons, and deep links

## Troubleshooting

### Notifications Not Appearing
1. Check if user is authenticated
2. Verify Firestore rules allow read access
3. Check browser console for errors
4. Ensure notification listener is set up in Layout component

### Notifications Not Updating in Real-time
1. Verify Firestore listener is active
2. Check network connectivity
3. Ensure no errors in console blocking listener

### Cannot Create Notifications
1. Verify user is authenticated
2. Check Firestore rules allow create access
3. Ensure all required fields are provided
4. Check for TypeScript/JavaScript errors

## Testing

To test the notification system:

1. **Create Test Notification**: Use browser console
```javascript
// In browser console (must be logged in)
const user = auth.currentUser;
await createNotification({
  userId: user.uid,
  title: 'Test Notification',
  message: 'This is a test',
  type: 'info'
});
```

2. **Check Firestore**: Verify notification appears in Firestore console
3. **Check UI**: Verify notification appears in notification bell
4. **Test Actions**: Try marking as read and clearing all

## Support

For issues or questions about the notification system:
1. Check this documentation
2. Review Firebase console for errors
3. Check browser console for JavaScript errors
4. Verify Firestore security rules are correctly configured
