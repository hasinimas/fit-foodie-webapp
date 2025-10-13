import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { UtensilsIcon, BrainIcon, ShoppingBagIcon, TrophyIcon, BarChartIcon, CheckIcon, ArrowRightIcon } from 'lucide-react';
const Home: React.FC = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your AI-Powered{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  Nutritional Ecosystem
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Personalized meal plans, smart food tracking, and AI-driven
                insights to help you achieve your health goals.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/login">
                  <Button size="lg" icon={<ArrowRightIcon size={18} />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 bg-emerald-500">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="Fit Foodie Dashboard" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Nutritional Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fit Foodie combines AI intelligence with nutritional science to
              create a personalized experience just for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <UtensilsIcon size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Meal Tracking
              </h3>
              <p className="text-gray-600">
                Log meals with text, voice, or photos. Our AI instantly
                calculates nutritional values and provides feedback.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BrainIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI Nutritional Coach
              </h3>
              <p className="text-gray-600">
                Get personalized recommendations, meal alternatives, and
                insights based on your preferences and goals.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBagIcon size={24} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Pantry
              </h3>
              <p className="text-gray-600">
                Track groceries, get shopping suggestions, and find recipes
                based on what you already have.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrophyIcon size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Challenges & Rewards
              </h3>
              <p className="text-gray-600">
                Stay motivated with personalized challenges, earn points, and
                unlock achievements as you progress.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChartIcon size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Visualize your journey with intuitive charts and detailed
                insights on your nutritional patterns.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <div className="h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Personalized Meal Plans
              </h3>
              <p className="text-gray-600">
                Get AI-generated meal plans tailored to your dietary
                preferences, restrictions, and nutritional goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Fit Foodie Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and transform your nutritional habits with
              our easy-to-use platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
              <div className="absolute -top-4 -left-4 h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
                Create Your Profile
              </h3>
              <p className="text-gray-600 mb-4">
                Sign up and complete a quick questionnaire about your dietary
                preferences, allergies, and nutritional goals.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Set your nutritional goals
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Specify dietary restrictions
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Get personalized recommendations
                  </span>
                </li>
              </ul>
            </div>
            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
              <div className="absolute -top-4 -left-4 h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
                Track Your Meals
              </h3>
              <p className="text-gray-600 mb-4">
                Log your meals easily using text, voice, or photos. Our AI
                analyzes and provides instant nutritional feedback.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Multiple logging options
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Instant nutritional analysis
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    AI-powered meal suggestions
                  </span>
                </li>
              </ul>
            </div>
            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
              <div className="absolute -top-4 -left-4 h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
                Achieve Your Goals
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized insights, complete challenges, and track your
                progress as you work toward your health goals.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Visual progress tracking
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Motivational challenges</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Continuous AI improvements
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their
              relationship with food.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">SK</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah K.</h4>
                  <p className="text-gray-500 text-sm">Lost 15kg in 6 months</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Fit Foodie changed my relationship with food. The AI
                suggestions are spot-on, and the meal plans are delicious and
                easy to follow. I've never felt better!"
              </p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">MT</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Michael T.</h4>
                  <p className="text-gray-500 text-sm">Fitness enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone who's serious about fitness, the protein tracking
                and meal suggestions have been game-changing. The app adapts to
                my changing needs perfectly."
              </p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-amber-600 font-bold">AP</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Aisha P.</h4>
                  <p className="text-gray-500 text-sm">Busy professional</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "With my hectic schedule, I never had time to plan meals. Fit
                Foodie makes it so easy with quick logging and smart pantry
                features. Meal planning is no longer a chore!"
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Your Nutritional Journey Today
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join thousands of users who are transforming their health with Fit
            Foodie's AI-powered nutritional ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button size="lg" variant="secondary" icon={<ArrowRightIcon size={18} />}>
                Sign Up Free
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Learn More
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
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Sales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Media Inquiries
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
export default Home;