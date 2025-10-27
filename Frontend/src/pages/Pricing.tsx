import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { CheckIcon, XIcon, ArrowRightIcon, ShieldIcon, CreditCardIcon, HelpCircleIcon } from 'lucide-react';
const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const navigate = useNavigate();
  const handleGetPremium = () => {
    // Navigate to payment process with plan info
    navigate('/payment-process', {
      state: {
        plan: {
          name: 'Premium',
          price: billingCycle === 'monthly' ? '9.99' : '7.99',
          billingCycle: billingCycle === 'monthly' ? 'month' : 'month, billed annually'
        }
      }
    });
  };
  return <div className="min-h-screen bg-white">
    <Navbar />
    {/* Hero Section */}
    <section className="bg-gradient-to-b from-emerald-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Choose the plan that fits your nutritional needs, with no hidden
            fees.
          </p>
          <div className="inline-flex items-center bg-white rounded-full p-1.5 border border-gray-200 shadow-sm">
            <button className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setBillingCycle('monthly')}>
              Monthly
            </button>
            <button className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${billingCycle === 'annual' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setBillingCycle('annual')}>
              Annual <span className="text-xs opacity-75">(Save 20%)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    {/* Pricing Cards */}
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all hover:translate-y-[-5px]">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Free</h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 ml-2">/forever</span>
              </div>
              <p className="mt-5 text-gray-600">
                Perfect for individuals just starting their nutritional
                journey
              </p>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Basic meal tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Voice Meal Log
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Basic nutritional insights
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Limited meal suggestions
                  </span>
                </li>
                <li className="flex items-start">
                  <XIcon size={20} className="text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <XIcon size={20} className="text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">AI meal planning</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/login">
                  <Button variant="outline" fullWidth size="lg" className="py-3">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-500 overflow-hidden relative transform transition-all hover:translate-y-[-5px]">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Premium
              </h3>
              <div className="flex items-baseline">
                <span className="text-5xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? '9.99' : '7.99'}
                </span>
                <span className="text-gray-500 ml-2">
                  /
                  {billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                </span>
              </div>
              <p className="mt-5 text-gray-600">
                For individuals serious about optimizing their nutrition
              </p>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Everything in Free plan
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Advanced analytics & insights
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Unlimited AI meal planning
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Smart pantry & grocery lists
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    Fitness app integrations
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={20} className="text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    1 nutritionist consultation/month
                  </span>
                </li>
              </ul>
              <div className="mt-8">
                <Button fullWidth size="lg" className="py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600" onClick={handleGetPremium}>
                  Get Premium
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* FAQs */}
    <section className="py-20 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Find answers to common questions about our pricing and plans.
          </p>
        </div>

        <div className="space-y-6">
          {[
            "Can I switch between plans?",
            "Is there a free trial for Premium?",
            "How do the nutritionist consultations work?",
            "What happens to my data if I cancel?",
          ].map((q, i) => (
            <div key={i}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
              <h3 className="text-xl font-bold text-emerald-700 mb-3">{q}</h3>
              <p className="text-gray-600">{[
                `Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, the new features will be immediately available. If you downgrade, you'll continue to have access to your current plan until the end of your billing cycle.`,
                `Yes, we offer a 14-day free trial of our Premium plan. You won't be charged until the trial period ends, and you can cancel anytime during the trial.`,
                `Premium subscribers get one 30-minute consultation per month with a registered dietitian. You can schedule these through the app, and they take place via video call.`,
                `If you cancel your subscription, you'll still have access to your data in read-only mode. You can export your data at any time. If you wish to delete your account completely, you can do so from the account settings, and all your data will be permanently removed.`,
              ][i]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Trust Signals */}
    <section className="py-20 bg-gradient-to-r from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Join the thousands of individuals who trust Fit Foodie for their nutritional guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-emerald-50 rounded-2xl shadow-md border border-emerald-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-center h-16 mb-6">
              <ShieldIcon size={40} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-emerald-800 mb-3">
              Secure & Private
            </h3>
            <p className="text-center text-emerald-700">
              Your data is encrypted and never shared with third parties. We take your privacy seriously.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-blue-50 rounded-2xl shadow-md border border-blue-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-center h-16 mb-6">
              <CreditCardIcon size={40} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-blue-800 mb-3">
              Easy Billing
            </h3>
            <p className="text-center text-blue-700">
              Simple, transparent billing with no hidden fees. Cancel anytime with just a few clicks.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-purple-50 rounded-2xl shadow-md border border-purple-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-center h-16 mb-6">
              <HelpCircleIcon size={40} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-purple-800 mb-3">
              24/7 Support
            </h3>
            <p className="text-center text-purple-700">
              Our customer support team is available around the clock to help with any questions.
            </p>
          </div>
        </div>
      </div>
    </section>
    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Start Your Nutritional Journey Today
        </h2>
        <p className="text-xl text-white opacity-90 mb-10 max-w-3xl mx-auto">
          Join thousands of users who are transforming their health with Fit
          Foodie's AI-powered nutritional ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/login">
            <Button size="lg" variant="secondary" icon={<ArrowRightIcon size={18} />} className="text-lg py-3 px-8">
              Get Started Free
            </Button>
          </Link>
          <Link to="/features">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg py-3 px-8">
              Explore Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
    {/* Footer */}
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-emerald-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">
                Fit Foodie
              </h1>
            </div>
            <p className="text-gray-400 mb-6">
              Your AI-powered nutritional ecosystem for healthier living.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Fit Foodie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>;
};
export default Pricing;

