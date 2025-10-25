import React, { useState, useEffect } from 'react';
// @ts-ignore - firebaseConfig is a .js file
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Button from './Button';

const UpgradeToPremium: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

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
            setIsPremium(false);
          } else {
            console.log('User plan: premium (valid until', expiresAt.toLocaleDateString(), ')');
            setIsPremium(true);
          }
        } else {
          setIsPremium(userPlan === 'premium');
          console.log('User plan:', userPlan);
        }
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
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

      setIsPremium(false);
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
    <Button 
      size="sm" 
      className="mt-3" 
      onClick={isPremium ? handleCancel : handleUpgrade}
      variant={isPremium ? "outline" : undefined}
    >
      {isPremium ? 'Cancel Premium' : 'Upgrade to Premium'}
    </Button>
  );
};

export default UpgradeToPremium;
