 import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { HeartIcon, GlobeIcon, UsersIcon, LightbulbIcon, ArrowRightIcon } from 'lucide-react';
const About: React.FC = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Fit Foodie
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're on a mission to transform how people understand and interact
              with nutrition through the power of AI.
            </p>
          </div>
        </div>
      </section>
      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="Fit Foodie Team" className="w-full h-auto object-cover" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Fit Foodie was founded in 2022 by a team of nutritionists, AI
                specialists, and health enthusiasts who shared a common
                frustration: nutrition apps weren't smart enough to truly
                understand individual needs.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What began as a small project to create a more intelligent food
                tracking system quickly evolved into a comprehensive nutritional
                ecosystem powered by advanced AI. Our goal was simple: make
                nutrition guidance personalized, accessible, and actionable for
                everyone.
              </p>
              <p className="text-lg text-gray-600">
                Today, Fit Foodie helps thousands of users around the world make
                better food choices, reach their health goals, and develop
                sustainable eating habits that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To empower people to make healthier food choices through
              accessible, personalized nutrition guidance powered by artificial
              intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="h-14 w-14 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HeartIcon size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Health First
              </h3>
              <p className="text-gray-600">
                We prioritize evidence-based nutritional science and sustainable
                health improvements over quick fixes.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <GlobeIcon size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Accessibility
              </h3>
              <p className="text-gray-600">
                We believe quality nutrition guidance should be available to
                everyone, regardless of background or location.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="h-14 w-14 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UsersIcon size={28} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">
                We foster a supportive community where users can share
                experiences and motivate each other.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="h-14 w-14 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LightbulbIcon size={28} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We continuously improve our AI and features to provide the most
                effective nutritional guidance possible.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate minds behind Fit Foodie who are dedicated to
              transforming nutritional health through technology.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" alt="Dr. Rajiv Patel" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Hasini De Silva
                </h3>
                <p className="text-emerald-600 font-medium mb-3">
                  Memmber 1
                </p>
                 <p className="text-gray-600">
                  Undergraduate At National Institute of Business Management (NIBM - Sri Lanka) | Software Engineering
                </p>
              </div>
            </div>
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" alt="Dr. Amara Silva" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Sahanya Kandanaarachchi
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  Member 2
                </p>
                <p className="text-gray-600">
                  Undergraduate At National Institute of Business Management (NIBM - Sri Lanka) | Software Engineering
                </p>
              </div>
            </div>
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" alt="Sam Lee" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                 Samuditha chandrakantha
                </h3>
                <p className="text-purple-600 font-medium mb-3">
                  Member 3
                </p>
                <p className="text-gray-600">
                 Undergraduate At National Institute of Business Management (NIBM - Sri Lanka) | Software Engineering
                </p>
              </div>
            </div>
            {/* Team Member 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" alt="Priya Nagarajan" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Senesh Jayamaha
                </h3>
                <p className="text-amber-600 font-medium mb-3">
                 Member 4
                </p>
                <p className="text-gray-600">
                 Undergraduate At National Institute of Business Management (NIBM - Sri Lanka)  Software Engineering
                </p>
              </div>
            </div>
           
          </div>
        </div>
      </section>
      {/* Our Impact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're proud of the positive change we're bringing to people's
              lives through better nutrition.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-4xl font-bold text-emerald-500 mb-2">
                25,000+
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Active Users
              </h3>
              <p className="text-gray-600">
                People using Fit Foodie daily to make better nutritional choices
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-4xl font-bold text-blue-500 mb-2">1.2M+</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Meals Tracked
              </h3>
              <p className="text-gray-600">
                Nutritional data analyzed to provide personalized insights
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-4xl font-bold text-amber-500 mb-2">85%</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Success Rate
              </h3>
              <p className="text-gray-600">
                Users who report reaching their nutritional goals with Fit
                Foodie
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are improving their health with Fit
            Foodie.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button size="lg" variant="secondary" icon={<ArrowRightIcon size={18} />}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-emerald-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FF</span>
                </div>
                <h1 className="ml-2 text-xl font-bold text-white">
                  Fit Foodie
                </h1>
              </div>
              <p className="text-gray-400 mb-4">
                Your AI-powered nutritional ecosystem for healthier living.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
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
export default About;

