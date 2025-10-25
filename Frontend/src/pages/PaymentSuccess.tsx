import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// @ts-ignore - firebaseConfig is a .js file
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Layout from '../components/Layout';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const savePaymentData = async () => {
      try {
        console.log('Starting payment data save...');
        
        // Get current user info
        const currentUser = auth.currentUser;
        console.log('Current user:', currentUser);
        
        const userId = currentUser?.uid || 'anonymous';
        const userEmail = currentUser?.email || 'no-email';
        const userName = currentUser?.displayName || 'Unknown User';

        // Get Stripe session ID from URL params (if available)
        const sessionId = searchParams.get('session_id') || searchParams.get('payment_intent') || null;
        console.log('Session ID from URL:', sessionId);
        
        // Generate a unique transaction ID
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Save payment data to Firestore
        const paymentData = {
          userId: userId,
          email: userEmail,
          userName: userName,
          planType: 'premium',
          price: 9.99,
          currency: 'USD',
          status: 'completed',
          method: 'stripe',
          stripe_link: 'https://buy.stripe.com/test_00w00j5NigcC9wx0eP4Ni00',
          transactionId: transactionId,
          paymentId: sessionId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        console.log('Payment data to save:', paymentData);
        console.log('Firestore db object:', db);
        
        const docRef = await addDoc(collection(db, 'payments'), paymentData);
        console.log('Payment saved successfully! Document ID:', docRef.id);
        
        setStatus('success');
        setMessage('Payment successful! Your premium account is now active.');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (error) {
        console.error('Error saving payment data:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        setStatus('error');
        setMessage(`Payment was successful but there was an error saving your data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    savePaymentData();
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
