import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// @ts-ignore - firebaseConfig is a .js file
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '../components/Layout';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    // Payment confirmation and update user plan to premium
    const confirmPayment = async () => {
      try {
        console.log('Payment confirmation received');
        
        // Wait for Firebase Auth to initialize and get current user
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (!currentUser) {
            console.log('No user logged in');
            setStatus('error');
            setMessage('User not logged in. Please log in and try again.');
            return;
          }
          
          try {
            // Get Stripe session ID from URL params (if available)
            const sessionId = searchParams.get('session_id') || searchParams.get('payment_intent') || null;
            console.log('Session ID from URL:', sessionId);
            console.log('Updating plan for user:', currentUser.uid);
            
            // Calculate expiry date (30 days from now)
            const expireDate = Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
            
            // Generate subscription ID
            const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Update user's plan to "premium" in Firebase with subscription details
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
              plan: 'premium',
              subscription: {
                subscriptionId: subscriptionId,
                upgradedAt: serverTimestamp(), // Real server time
                expiresAt: expireDate, // 30 days from now
                stripeSessionId: sessionId || 'N/A',
                status: 'active'
              }
            });
            
            console.log('User plan updated to premium successfully');
            console.log('Subscription details:', {
              subscriptionId,
              expiresIn: '30 days'
            });
            
            setStatus('success');
            setMessage('Payment successful! Your premium account is now active.');
            
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          } catch (error) {
            console.error('Error processing payment confirmation:', error);
            setStatus('error');
            setMessage(`There was an error activating your premium account: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });

        // Cleanup subscription
        return () => unsubscribe();
        
      } catch (error) {
        console.error('Error processing payment confirmation:', error);
        setStatus('error');
        setMessage(`There was an error activating your premium account: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-16 p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Processing Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircleIcon size={64} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircleIcon size={64} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Error Saving Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
              <button
                onClick={() => navigate('/settings')}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Return to Settings
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
