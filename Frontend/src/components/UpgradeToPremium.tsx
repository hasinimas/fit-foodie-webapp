import React, { useState, useEffect } from 'react';
// @ts-ignore - firebaseConfig is a .js file
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import Button from './Button';

const UpgradeToPremium: React.FC = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);

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

      // Query for completed payments for this user
      const paymentsRef = collection(db, 'payments');
      const q = query(
        paymentsRef,
        where('userId', '==', currentUser.uid),
        where('status', '==', 'completed'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const paymentDoc = querySnapshot.docs[0];
        const paymentData = paymentDoc.data();
        const createdAt = paymentData.createdAt?.toDate();
        
        if (createdAt) {
          // Check if payment is still within 1 year
          const oneYearFromPayment = new Date(createdAt);
          oneYearFromPayment.setFullYear(oneYearFromPayment.getFullYear() + 1);
          
          const isStillActive = new Date() < oneYearFromPayment;
          setIsPremium(isStillActive);
          setActivePaymentId(isStillActive ? paymentDoc.id : null);
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
    // Payment data will be saved to Firebase only after successful payment
    window.open('https://buy.stripe.com/test_00w00j5NigcC9wx0eP4Ni00', '_blank');
  };

  const handleCancel = async () => {
    if (!activePaymentId) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel your premium subscription? You will lose access to premium features.'
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      
      // Update payment status to 'cancelled'
      const paymentDocRef = doc(db, 'payments', activePaymentId);
      await updateDoc(paymentDocRef, {
        status: 'cancelled',
        cancelledAt: new Date(),
      });

      setIsPremium(false);
      setActivePaymentId(null);
      alert('Premium subscription cancelled successfully.');
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
