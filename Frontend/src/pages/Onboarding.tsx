import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  HeartIcon,
  ActivityIcon,
  BrainIcon,
  ScaleIcon,
  SaladIcon
} from 'lucide-react';
import { auth, db } from '../firebaseConfig'; // ✅ Firebase import
import { doc, setDoc } from 'firebase/firestore'; // ✅ Firestore import

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
}

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Firestore save function
  const saveUserOnboardingData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setLoading(true);

      await setDoc(
        doc(db, "users", user.uid),
        {
          onboarding: {
            goal,
            quizAnswers,
            completedAt: new Date().toISOString(),
          },
          completedOnboarding: true,
        },
        { merge: true }
      );

      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setLoading(false);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (currentQuizQuestion >= quizQuestions[goal].length - 1) {
        setStep(3);
      } else {
        setCurrentQuizQuestion(currentQuizQuestion + 1);
      }
    } else {
      // ✅ Save onboarding details on final step
      await saveUserOnboardingData();
    }
  };

  const handleBack = () => {
    if (step === 1) return;
    if (step === 2) {
      if (currentQuizQuestion === 0) setStep(1);
      else setCurrentQuizQuestion(currentQuizQuestion - 1);
    } else {
      setStep(2);
    }
  };

  const handleQuizAnswer = (questionId: string, answerId: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  // 🔹 Goals list
  const goals = [
    {
      id: 'lose-weight',
      title: 'Lose Weight',
      description: 'Reduce body fat and reach a healthier weight',
      icon: <ScaleIcon size={32} className="text-emerald-500" />,
      color: 'emerald'
    },
    {
      id: 'gain-muscle',
      title: 'Gain Muscle',
      description: 'Build strength and increase muscle mass',
      icon: <ActivityIcon size={32} className="text-blue-500" />,
      color: 'blue'
    },
    {
      id: 'maintain-weight',
      title: 'Maintain Weight',
      description: 'Keep your current weight while improving nutrition',
      icon: <HeartIcon size={32} className="text-purple-500" />,
      color: 'purple'
    },
    {
      id: 'improve-energy',
      title: 'Improve Energy Levels',
      description: 'Feel more energetic throughout the day',
      icon: <BrainIcon size={32} className="text-amber-500" />,
      color: 'amber'
    },
    {
      id: 'eat-healthier',
      title: 'Eat Healthier',
      description: 'Focus on nutritious foods and balanced diet',
      icon: <SaladIcon size={32} className="text-green-500" />,
      color: 'green'
    }
  ];

  // 🔹 Quiz questions (full as per your original code)
  const quizQuestions: Record<string, QuizQuestion[]> = {
    'lose-weight': [
      {
        id: 'lose-weight-1',
        question: 'How would you describe your current activity level?',
        options: [
          { id: 'sedentary', text: 'Sedentary (little to no exercise)' },
          { id: 'light', text: 'Light (1-3 days of exercise per week)' },
          { id: 'moderate', text: 'Moderate (3-5 days of exercise per week)' },
          { id: 'active', text: 'Active (6-7 days of exercise per week)' },
          { id: 'very-active', text: 'Very active (professional athlete level)' }
        ]
      },
      {
        id: 'lose-weight-2',
        question: 'How much weight would you like to lose?',
        options: [
          { id: 'small', text: 'A small amount (5-10 lbs/2-5 kg)' },
          { id: 'moderate', text: 'A moderate amount (10-20 lbs/5-10 kg)' },
          { id: 'significant', text: 'A significant amount (20+ lbs/10+ kg)' }
        ]
      },
      {
        id: 'lose-weight-3',
        question: 'What has been your biggest challenge with weight loss?',
        options: [
          { id: 'cravings', text: 'Controlling cravings and hunger' },
          { id: 'motivation', text: 'Staying motivated' },
          { id: 'time', text: 'Finding time to prepare healthy meals' },
          { id: 'knowledge', text: 'Knowing what to eat' },
          { id: 'plateaus', text: 'Getting past plateaus' }
        ]
      }
    ],
    'gain-muscle': [
      {
        id: 'gain-muscle-1',
        question: 'What is your current workout routine?',
        options: [
          { id: 'none', text: "I don't work out regularly" },
          { id: 'beginner', text: 'Beginner (just starting with weights)' },
          { id: 'intermediate', text: 'Intermediate (consistent for 3-12 months)' },
          { id: 'advanced', text: 'Advanced (consistent for 1+ years)' }
        ]
      },
      {
        id: 'gain-muscle-2',
        question: 'How would you describe your body type?',
        options: [
          { id: 'ectomorph', text: 'Slim/lean, difficulty gaining weight' },
          { id: 'mesomorph', text: 'Athletic, gain/lose weight relatively easily' },
          { id: 'endomorph', text: 'Naturally higher body fat, gain muscle easily' }
        ]
      },
      {
        id: 'gain-muscle-3',
        question: 'What is your biggest challenge with muscle gain?',
        options: [
          { id: 'eating-enough', text: 'Eating enough calories' },
          { id: 'protein', text: 'Getting enough protein' },
          { id: 'consistency', text: 'Workout consistency' },
          { id: 'knowledge', text: 'Knowing the right exercises' },
          { id: 'recovery', text: 'Recovery between workouts' }
        ]
      }
    ],
    'maintain-weight': [
      {
        id: 'maintain-weight-1',
        question: 'How stable has your weight been in the past year?',
        options: [
          { id: 'very-stable', text: 'Very stable (within 2-3 lbs/1-1.5 kg)' },
          { id: 'somewhat-stable', text: 'Somewhat stable (within 5-10 lbs/2-5 kg)' },
          { id: 'fluctuating', text: 'Fluctuating (changes of 10+ lbs/5+ kg)' }
        ]
      },
      {
        id: 'maintain-weight-2',
        question: 'What is your main reason for wanting to maintain your weight?',
        options: [
          { id: 'health', text: 'General health maintenance' },
          { id: 'athletic', text: 'Athletic performance' },
          { id: 'appearance', text: 'Appearance/confidence' },
          { id: 'medical', text: 'Medical reasons' }
        ]
      },
      {
        id: 'maintain-weight-3',
        question: 'Which aspect of nutrition would you like to improve most?',
        options: [
          { id: 'balance', text: 'Overall nutritional balance' },
          { id: 'quality', text: 'Food quality and whole foods' },
          { id: 'variety', text: 'Variety in diet' },
          { id: 'consistency', text: 'Consistency in eating patterns' }
        ]
      }
    ],
    'improve-energy': [
      {
        id: 'improve-energy-1',
        question: 'When do you typically experience low energy?',
        options: [
          { id: 'morning', text: 'Morning' },
          { id: 'afternoon', text: 'Afternoon slump' },
          { id: 'evening', text: 'Evening' },
          { id: 'all-day', text: 'Throughout the day' }
        ]
      },
      {
        id: 'improve-energy-2',
        question: 'How would you rate your sleep quality?',
        options: [
          { id: 'poor', text: 'Poor (difficulty falling/staying asleep)' },
          { id: 'fair', text: 'Fair (sometimes restful)' },
          { id: 'good', text: 'Good (usually restful)' },
          { id: 'excellent', text: 'Excellent (consistently restful)' }
        ]
      },
      {
        id: 'improve-energy-3',
        question: 'Which of these factors do you think affects your energy most?',
        options: [
          { id: 'diet', text: 'Diet and nutrition' },
          { id: 'sleep', text: 'Sleep quality' },
          { id: 'stress', text: 'Stress levels' },
          { id: 'hydration', text: 'Hydration' },
          { id: 'activity', text: 'Physical activity' }
        ]
      }
    ],
    'eat-healthier': [
      {
        id: 'eat-healthier-1',
        question: 'How would you rate your current eating habits?',
        options: [
          { id: 'poor', text: 'Poor (mostly processed foods)' },
          { id: 'fair', text: 'Fair (mix of healthy and unhealthy)' },
          { id: 'good', text: 'Good (mostly healthy with occasional treats)' },
          { id: 'excellent', text: 'Excellent (consistently healthy)' }
        ]
      },
      {
        id: 'eat-healthier-2',
        question: 'Which aspect of healthy eating interests you most?',
        options: [
          { id: 'whole-foods', text: 'Incorporating more whole foods' },
          { id: 'plant-based', text: 'Adding more plant-based options' },
          { id: 'reducing-processed', text: 'Reducing processed foods' },
          { id: 'balanced-meals', text: 'Creating balanced meals' },
          { id: 'portion-control', text: 'Better portion control' }
        ]
      },
      {
        id: 'eat-healthier-3',
        question: 'What is your biggest obstacle to eating healthier?',
        options: [
          { id: 'time', text: 'Time constraints for meal preparation' },
          { id: 'cost', text: 'Cost of healthy foods' },
          { id: 'knowledge', text: 'Knowledge of nutrition' },
          { id: 'cravings', text: 'Cravings for unhealthy foods' },
          { id: 'social', text: 'Social situations and eating out' }
        ]
      }
    ]
  };

  const currentQuestion = goal ? quizQuestions[goal][currentQuizQuestion] : null;
  const currentAnswer = currentQuestion ? quizAnswers[currentQuestion.id] : null;
  const isQuizQuestionAnswered = !!currentAnswer;

  const getGoalIcon = (goalId: string) => goals.find(g => g.id === goalId)?.icon || null;
  const getGoalColor = (goalId: string) => goals.find(g => g.id === goalId)?.color || 'emerald';

  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-emerald-50 to-blue-50">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">FF</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    i < step
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                      : i === step
                      ? 'bg-white border-2 border-emerald-500 text-emerald-500'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? <CheckIcon size={16} /> : i}
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(step - 1) / 2 * 100}%` }}
              />
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Saving your preferences...</p>
              </div>
            ) : (
              <>
                {/* Step 1: Goal Selection */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      What's your primary goal?
                    </h2>
                    <div className="space-y-4">
                      {goals.map(g => (
                        <label
                          key={g.id}
                          className={`flex items-center p-4 border ${
                            goal === g.id ? `border-${g.color}-500 bg-${g.color}-50` : 'border-gray-200'
                          } rounded-xl cursor-pointer hover:bg-gray-50 transition-all`}
                          onClick={() => setGoal(g.id)}
                        >
                          <div className={`flex-shrink-0 h-14 w-14 bg-${g.color}-100 rounded-full flex items-center justify-center mr-4`}>
                            {g.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-800">{g.title}</h3>
                              <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                goal === g.id ? `border-${g.color}-500 bg-${g.color}-500` : 'border-gray-300'
                              }`}>
                                {goal === g.id && <CheckIcon size={12} className="text-white" />}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{g.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {/* Step 2: Goal-specific Quiz */}
                {step === 2 && currentQuestion && (
                  <>
                    <div className="flex items-center mb-6">
                      <div className={`h-12 w-12 bg-${getGoalColor(goal)}-100 rounded-full flex items-center justify-center mr-4`}>
                        {getGoalIcon(goal)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{goals.find(g => g.id === goal)?.title} Quiz</h3>
                        <p className="text-sm text-gray-600">
                          Question {currentQuizQuestion + 1} of {quizQuestions[goal].length}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>
                      <div className="space-y-3">
                        {currentQuestion.options.map(option => (
                          <label
                            key={option.id}
                            className={`flex items-center p-4 border ${
                              quizAnswers[currentQuestion.id] === option.id
                                ? `border-${getGoalColor(goal)}-500 bg-${getGoalColor(goal)}-50`
                                : 'border-gray-200'
                            } rounded-xl cursor-pointer hover:bg-gray-50 transition-all`}
                            onClick={() => handleQuizAnswer(currentQuestion.id, option.id)}
                          >
                            <input
                              type="radio"
                              name={currentQuestion.id}
                              value={option.id}
                              checked={quizAnswers[currentQuestion.id] === option.id}
                              onChange={() => handleQuizAnswer(currentQuestion.id, option.id)}
                              className="hidden"
                            />
                            <span className="ml-3 text-gray-700">{option.text}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Completion */}
                {step === 3 && (
                  <div className="text-center py-10">
                    <CheckIcon size={48} className="text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">You're all set!</h2>
                    <p className="text-gray-600 mb-6">Your goals and quiz answers have been saved.</p>
                    <Button
                      onClick={saveUserOnboardingData}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Navigation Buttons */}
            {!loading && step < 3 && (
              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    icon={<ArrowLeftIcon size={16} />}
                  >
                    Back
                  </Button>
                ) : <div></div>}
                <Button
                  onClick={handleNext}
                  disabled={(step === 1 && !goal) || (step === 2 && !isQuizQuestionAnswered)}
                  className={`${
                    (step === 1 && !goal) || (step === 2 && !isQuizQuestionAnswered)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600'
                  }`}
                  icon={<ArrowRightIcon size={16} />}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
