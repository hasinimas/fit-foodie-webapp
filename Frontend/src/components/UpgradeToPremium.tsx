import React, { useState, useEffect } from 'react';
// @ts-ignore - firebaseConfig is a .js file
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Button from './Button';
import { createNotification } from '../services/notificationService';

const UpgradeToPremium: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isPremium || !expiryDate) {
      setTimeRemaining('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        checkPremiumStatus(); // Re-check status if expired
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isPremium, expiryDate]);

  const checkPremiumStatus = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      // Check user's plan field in Firebase
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userPlan = userData.plan || 'free';
        const subscription = userData.subscription;
        
        // Check if subscription exists and is valid
        if (userPlan === 'premium' && subscription) {
          // Handle Firestore Timestamp object
          let expiresAt: Date;
          if (subscription.expiresAt?.toDate) {
            // Firebase Timestamp object
            expiresAt = subscription.expiresAt.toDate();
          } else if (subscription.expiresAt?.seconds) {
            // Firebase Timestamp in seconds format
            expiresAt = new Date(subscription.expiresAt.seconds * 1000);
          } else {
            // ISO string or regular date
            expiresAt = new Date(subscription.expiresAt);
          }
          
          const now = new Date();
          
          // Check if subscription has expired
          if (now > expiresAt) {
            console.log('Subscription expired, downgrading to free plan');
            // Auto-downgrade to free plan
            await updateDoc(userDocRef, {
              plan: 'free',
              subscription: {
                ...subscription,
                status: 'expired',
                expiredAt: serverTimestamp()
              }
            });
            
            // Create notification for subscription expiry
            await createNotification({
              userId: currentUser.uid,
              title: 'Premium Subscription Expired',
              message: 'Your premium subscription has expired. Upgrade again to continue enjoying premium features!',
              type: 'info',
            });
            
            setIsPremium(false);
          } else {
            console.log('User plan: premium (valid until', expiresAt.toLocaleDateString(), ')');
            setIsPremium(true);
            setExpiryDate(expiresAt);
          }
        } else {
          setIsPremium(userPlan === 'premium');
          setExpiryDate(null);
          console.log('User plan:', userPlan);
        }
      } else {
        setIsPremium(false);
        setExpiryDate(null);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      setExpiryDate(null);
    }
    setLoading(false);
  };

  const handleUpgrade = () => {
    // Open Stripe payment link in new tab
    // After successful payment, PaymentSuccess page will update plan to "premium"
    window.open('https://buy.stripe.com/test_00w00j5NigcC9wx0eP4Ni00', '_blank');
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel your premium subscription? You will lose access to premium features.'
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert('User not logged in.');
        setLoading(false);
        return;
      }

      // Update user's plan back to "free" and mark subscription as cancelled
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const subscription = userData?.subscription;
      
      await updateDoc(userDocRef, {
        plan: 'free',
        subscription: subscription ? {
          ...subscription,
          status: 'cancelled',
          cancelledAt: serverTimestamp() // Real server time
        } : null
      });

      // Create notification for premium cancellation
      await createNotification({
        userId: currentUser.uid,
        title: 'Premium Subscription Cancelled',
        message: 'Your premium subscription has been cancelled. You are now on the free plan.',
        type: 'info',
      });

      setIsPremium(false);
      setExpiryDate(null);
      alert('Premium subscription cancelled successfully. Your plan has been changed to Free.');
    } catch (error) {
      console.error('Error cancelling premium:', error);
      alert('Failed to cancel premium subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button size="sm" className="mt-3" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <div>
      <Button 
        size="sm" 
        className="mt-3" 
        onClick={isPremium ? handleCancel : handleUpgrade}
        variant={isPremium ? "outline" : undefined}
      >
        {isPremium ? 'Cancel Premium' : 'Upgrade to Premium'}
      </Button>
      
      {isPremium && timeRemaining && (
        <div className="mt-2 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Time remaining: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{timeRemaining}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default UpgradeToPremium;
