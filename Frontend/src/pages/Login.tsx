import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { MailIcon, LockIcon, UserIcon, CalendarIcon, CakeIcon, HeartIcon, AlertCircleIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react';
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


  interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  dietPreference: string;
  allergies: string[]; 
}
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    dietPreference: '',
    allergies: []        // explicit type: string[], so TypeScript enforces array of strings
  });

  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAllergiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      value,
      checked
    } = e.target;
    setFormData(prev => ({
      ...prev,
      allergies: checked ? [...(prev.allergies as string[]), value] : (prev.allergies as string[]).filter(item => item !== value)
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
 {/* const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      navigate('/dashboard');
    } else {
      if (currentStep < 3) {
        handleNextStep();
      } else {
        navigate('/onboarding');
      }
    }
  };*/}
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isLogin) {
    // 🔐 Login existing user
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setMessage({ type: 'success', text: 'Login successful!' });
      navigate("/dashboard");
    } catch (error: any) {
      setMessage({ type: 'error', text: "Login failed: " + error.message });
    }
  } else {
    // Register new user
    if (currentStep < 3) {
      handleNextStep();
      return;
    }

    try {
      // Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        dietPreference: formData.dietPreference,
        allergies: formData.allergies,
        plan: "free", // Default plan for new users
        createdAt: new Date().toISOString(),
      });
      setMessage({ type: 'success', text: 'Account created successfully!' });
      navigate("/onboarding");
    } catch (error: any) {
      setMessage({ type: 'error', text: "Registration failed: " + error.message });
    }
  }
};

  const dietaryPreferences = ['No Restrictions', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Low Carb', 'Mediterranean', 'Gluten-Free'];
  const commonAllergies = ['Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Wheat/Gluten', 'Fish', 'Shellfish'];
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const isFirstStepValid = formData.firstName && formData.lastName && formData.email && formData.password && formData.password.length >= 8;
  const isSecondStepValid = formData.age && formData.gender;
  return <Layout hideNavigation>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-emerald-500/10">
        <div className="w-full max-w-xl">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-block relative">
              <div className="h-24 w-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl transform rotate-12">
                <span className="text-white font-bold text-4xl">FF</span>
              </div>
              <div className="absolute -bottom-3 -right-3 h-10 w-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="mt-8 text-4xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Fit Foodie
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Your AI-powered nutritional ecosystem
            </p>
          </div>
          {/* Auth Card */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-40 w-40 bg-blue-500/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-48 w-48 bg-emerald-500/10 rounded-full"></div>
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-10 relative z-10">
              <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner w-full max-w-xs">
                <button className={`flex-1 px-8 py-3 rounded-xl text-sm font-medium transition-all ${isLogin ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => {
                setIsLogin(true);
                setCurrentStep(1);
              }}>
                  Login
                </button>
                <button className={`flex-1 px-8 py-3 rounded-xl text-sm font-medium transition-all ${!isLogin ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => {
                setIsLogin(false);
                setCurrentStep(1);
              }}>
                  Register
                </button>
              </div>
            </div>
            {isLogin ?
          // Login Form
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MailIcon size={18} className="text-gray-400" />
                    </div>
                    <input id="login-email" name="email" type="email" required className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockIcon size={18} className="text-gray-400" />
                    </div>
                    <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} required className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      {showPassword ? <EyeOffIcon size={18} className="text-gray-400" /> : <EyeIcon size={18} className="text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" fullWidth size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 py-4 rounded-xl">
                    Sign In
                  </Button>
                </div>
              </form> :
          // Registration Form with Steps
          <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex space-x-3">
                    {[1, 2, 3].map(step => <div key={step} className={`h-3 w-12 rounded-full ${step === currentStep ? 'bg-emerald-500' : step < currentStep ? 'bg-emerald-300' : 'bg-gray-200'}`} />)}
                  </div>
                  <span className="text-sm text-gray-500">
                    Step {currentStep} of 3
                  </span>
                </div>
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && <div className="space-y-5">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Create your account
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                            First Name
                          </label>
                          <div className="relative">
                            <input id="firstName" name="firstName" type="text" required className="w-full rounded-xl border border-gray-300 py-3.5 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="First name" value={formData.firstName} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Last Name
                          </label>
                          <div className="relative">
                            <input id="lastName" name="lastName" type="text" required className="w-full rounded-xl border border-gray-300 py-3.5 px-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MailIcon size={18} className="text-gray-400" />
                          </div>
                          <input id="email" name="email" type="email" required className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockIcon size={18} className="text-gray-400" />
                          </div>
                          <input id="password" name="password" type={showPassword ? 'text' : 'password'} required minLength={8} className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="Create a password (min. 8 characters)" value={formData.password} onChange={handleInputChange} />
                          <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            {showPassword ? <EyeOffIcon size={18} className="text-gray-400" /> : <EyeIcon size={18} className="text-gray-400" />}
                          </button>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">
                          Password must be at least 8 characters long
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button type="button" fullWidth size="lg" className={`bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 py-4 rounded-xl ${!isFirstStepValid ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleNextStep} disabled={!isFirstStepValid}>
                          Continue
                        </Button>
                      </div>
                    </div>}
                  {currentStep === 2 && <div className="space-y-5">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Personal Information
                      </h2>
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Age
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <CakeIcon size={18} className="text-gray-400" />
                          </div>
                          <input id="age" name="age" type="number" min="13" max="120" required className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm" placeholder="Your age" value={formData.age} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Gender
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserIcon size={18} className="text-gray-400" />
                          </div>
                          <select id="gender" name="gender" required className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm appearance-none" value={formData.gender} onChange={handleInputChange}>
                            <option value="" disabled>
                              Select your gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not-to-say">
                              Prefer not to say
                            </option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-6 gap-4">
                        <Button type="button" variant="outline" size="lg" className="flex-1 py-4 rounded-xl" onClick={handlePrevStep}>
                          Back
                        </Button>
                        <Button type="button" size="lg" className={`flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 py-4 rounded-xl ${!isSecondStepValid ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleNextStep} disabled={!isSecondStepValid}>
                          Continue
                        </Button>
                      </div>
                    </div>}
                  {currentStep === 3 && <div className="space-y-5">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Dietary Preferences
                      </h2>
                      <div>
                        <label htmlFor="dietPreference" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Diet Preference
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <HeartIcon size={18} className="text-gray-400" />
                          </div>
                          <select id="dietPreference" name="dietPreference" className="pl-12 w-full rounded-xl border border-gray-300 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm appearance-none" value={formData.dietPreference} onChange={handleInputChange}>
                            <option value="" disabled>
                              Select your diet preference
                            </option>
                            {dietaryPreferences.map(diet => <option key={diet} value={diet.toLowerCase()}>
                                {diet}
                              </option>)}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allergies or Restrictions
                        </label>
                        <div className="relative">
                          <div className="absolute top-4 left-4">
                            <AlertCircleIcon size={18} className="text-gray-400" />
                          </div>
                          <div className="pl-12 p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2">
                              {commonAllergies.map(allergy => <div key={allergy} className="flex items-start">
                                  <input id={`allergy-${allergy}`} name="allergies" type="checkbox" value={allergy} checked={(formData.allergies as string[])?.includes(allergy)} onChange={handleAllergiesChange} className="h-4 w-4 mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                                  <label htmlFor={`allergy-${allergy}`} className="ml-2 block text-sm text-gray-700">
                                    {allergy}
                                  </label>
                                </div>)}
                            </div>
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">
                          Select all that apply
                        </p>
                      </div>
                      <div className="flex justify-between pt-6 gap-4">
                        <Button type="button" variant="outline" size="lg" className="flex-1 py-4 rounded-xl" onClick={handlePrevStep}>
                          Back
                        </Button>
                        <Button type="submit" size="lg" className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 py-4 rounded-xl">
                          Create Account
                        </Button>
                      </div>
                    </div>}
                </form>
              </div>}
          </div>
          {/* Footer Text */}
          <div className="mt-8 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => {
            setIsLogin(!isLogin);
            setCurrentStep(1);
          }} className="text-emerald-600 hover:text-emerald-700 font-medium">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
          {/* Terms and Privacy */}
          <div className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link to="#" className="text-emerald-600 hover:text-emerald-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="#" className="text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Login;
