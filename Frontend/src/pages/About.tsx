import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { HeartIcon, GlobeIcon, UsersIcon, LightbulbIcon, ArrowRightIcon } from 'lucide-react';
import seneshImage from '../assets/senesh.jpeg';
import sahanyaImage from '../assets/sahanya.jpg';
import samudithaImage from '../assets/samuditha.jpg';
import hasiniImage from '../assets/hasini.jpg';
import { color } from 'framer-motion';

const About: React.FC = () => {
  const missionCards = [
    { icon: HeartIcon, title: 'Health First', color:'from-green-100 to-green-300', textColor: 'text-green-700', desc: 'We prioritize evidence-based nutritional science and sustainable health improvements.' },
    { icon: GlobeIcon, title: 'Accessibility', color: 'from-blue-200 to-blue-400', textColor: 'text-blue-700', desc: 'Quality nutrition guidance should be available to everyone.' },
    { icon: UsersIcon, title: 'Community', color: 'from-yellow-200 to-yellow-400', textColor: 'text-yellow-700', desc: 'We foster a supportive community where users can share experiences.' },
    { icon: LightbulbIcon, title: 'Innovation', color: 'from-purple-200 to-purple-400', textColor: 'text-purple-700', desc: 'We continuously improve our AI to provide effective nutritional guidance.' },
  ];

  const teamMembers = [
    { img: hasiniImage, name: 'Hasini De Silva', role: 'Frontend Developer', roleColor: 'text-purple-500', bio: 'Undergraduate At NIBM | Software Engineering' },
    { img: sahanyaImage, name: 'Sahanya Kandanaarachchi', role: 'Backend Developer', roleColor: 'text-orange-600', bio: 'Undergraduate At NIBM | Software Engineering' },
    { img: samudithaImage, name: 'Samuditha Chandraka', role: 'AI & Nutrition Analyst', roleColor: 'text-green-500', bio: 'Undergraduate At NIBM | Software Engineering' },
    { img: seneshImage, name: 'Senesh Jayamaha', role: 'UI/UX Designer', roleColor: 'text-yellow-600', bio: 'Undergraduate At NIBM | Software Engineering' },
  ];

  const impactStats = [
    { value: '25,000+', label: 'Active Users', color: 'text-green-500', desc: 'People using Fit Foodie daily to make better nutritional choices' },
    { value: '1.2M+', label: 'Meals Tracked', color: 'text-blue-500', desc: 'Nutritional data analyzed to provide personalized insights' },
    { value: '85%', label: 'Success Rate', color: 'text-yellow-500', desc: 'Users who report reaching their nutritional goals with Fit Foodie' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">
          About{' '}
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Fit Foodie
          </span>
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Transforming how people understand and interact with nutrition through AI.
        </p>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gradient-to-r from-green-100 via-blue-200 to-purple-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex md:gap-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 h-55 md:h-86">
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                alt="Fit Foodie Team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="md:w-3/4">
            <br /> <br /> <br /> <br />
            <h2 className="text-4xl font-bold text-gray-900 mb-9">Our Story</h2> 
            <p className="text-lg text-gray-700 text-justify">
              Fit Foodie was created by a team of passionate nutritionists, AI innovators, and health enthusiasts to transform how people approach nutrition.
              What started as a small experiment quickly grew into an AI-powered ecosystem that provides personalized insights for healthier living.
              Our platform helps users make smarter food choices, track nutrition effortlessly, and achieve their wellness goals.
              Today, thousands rely on Fit Foodie to build sustainable eating habits and embrace a healthier, balanced lifestyle.
            </p>
          </div>
        </div>
      </section>


      {/* Our Mission */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Empower people to make healthier food choices through AI-powered personalized guidance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {missionCards.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-6 text-center hover:scale-105 transform transition-transform duration-300`}
            >
              <div className={`h-14 w-14 mx-auto mb-4 rounded-lg flex items-center justify-center bg-gradient-to-tr ${item.color}`}>
                <item.icon size={28} className={item.textColor} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-800">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            The passionate minds behind Fit Foodie transforming nutritional health through technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className="h-56">
                <img src={member.img} alt={member.name} className="w-full h-full object-contain object-center" />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mb-1">
                  {member.name}
                </h3>
                <p className={`${member.roleColor} font-medium mb-2`}>{member.role}</p>
                <p className="text-gray-700 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Making a positive change in people's lives through better nutrition.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {impactStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/40 backdrop-blur-md rounded-xl shadow-lg p-8 hover:scale-105 transition-transform duration-300"
            >
              <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
              <h3 className="text-xl font-bold mb-3">{stat.label}</h3>
              <p className="text-gray-800">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-400 to-blue-400 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Transform Your Nutrition?
        </h2>
        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
          Join thousands of users improving their health with Fit Foodie.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/login">
            <Button size="lg" variant="secondary" icon={<ArrowRightIcon size={18} />}>
              Get Started Free
            </Button>
          </Link>
          <Link to="/features">
            <Button size="lg" className="bg-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 font-bold shadow-2xl border-2 border-white transform hover:scale-105 transition-all">
               Explore Features
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
