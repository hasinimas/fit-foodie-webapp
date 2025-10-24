import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { TrophyIcon, StarIcon, TrendingUpIcon, LockIcon, CheckIcon, AwardIcon, PlusIcon, BellIcon, XIcon } from 'lucide-react';
import '../styles/Challenges.css';
// Define types for our data structures
interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
}
interface ActiveChallenge extends Challenge {
  progress: number;
  total: number;
  daysLeft: number;
  color: string;
}
interface AvailableChallenge extends Challenge {
  difficulty: string;
}
interface CompletedChallenge extends Challenge {
  completedDate: string;
}
interface Badge {
  id: number;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
}
const Challenges: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('active');
  // Mock data for active challenges
  const activeChallenges: ActiveChallenge[] = [{
    id: 1,
    title: 'Plant-Based Week',
    description: 'Eat 5 plant-based meals this week',
    progress: 2,
    total: 5,
    daysLeft: 3,
    points: 200,
    color: 'amber'
  }, {
    id: 2,
    title: 'Hydration Hero',
    description: 'Drink 2.5L of water daily for 5 days',
    progress: 3,
    total: 5,
    daysLeft: 2,
    points: 150,
    color: 'blue'
  }];
  // Mock data for available challenges
  const availableChallenges: AvailableChallenge[] = [{
    id: 3,
    title: 'Protein Power',
    description: 'Hit your protein goal for 7 consecutive days',
    points: 250,
    difficulty: 'Medium'
  }, {
    id: 4,
    title: 'Meal Prep Master',
    description: 'Log 3 home-cooked meals in advance',
    points: 100,
    difficulty: 'Easy'
  }, {
    id: 5,
    title: 'Sugar Detox',
    description: 'Stay under 25g of added sugar for 5 days',
    points: 300,
    difficulty: 'Hard'
  }];
  // Mock data for completed challenges
  const completedChallenges: CompletedChallenge[] = [{
    id: 6,
    title: 'First Steps',
    description: 'Log your first 3 meals',
    completedDate: '2 days ago',
    points: 50
  }, {
    id: 7,
    title: 'Water Works',
    description: 'Track your water intake for 3 consecutive days',
    completedDate: '1 week ago',
    points: 75
  }];
  // Mock data for badges
  const badges: Badge[] = [{
    id: 1,
    name: 'Green Guru',
    description: 'Completed Plant-Based Week challenge',
    image: '🌱',
    unlocked: false
  }, {
    id: 2,
    name: 'Early Bird',
    description: 'Logged breakfast before 8am for 5 days',
    image: '🐦',
    unlocked: false
  }, {
    id: 3,
    name: 'Newbie',
    description: 'Created your account and completed onboarding',
    image: '🌟',
    unlocked: true
  }, {
    id: 4,
    name: 'Hydration Hero',
    description: 'Met water goals for 7 consecutive days',
    image: '💧',
    unlocked: false
  }];
  // Mock notifications
  const [notifications, setNotifications] = useState([{
    id: 'notif1',
    title: 'Challenge Almost Complete!',
    message: 'You\'re just 2 steps away from completing "Hydration Hero"',
    time: '2 hours ago'
  }, {
    id: 'notif2',
    title: 'New Badge Unlocked!',
    message: 'Congratulations! You\'ve earned the "Newbie" badge.',
    time: 'Yesterday'
  }]);
  const [showNotification, setShowNotification] = useState(false);
  const createChallenge = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };
  const getDifficultyClass = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy':
        return 'difficulty-easy';
      case 'Medium':
        return 'difficulty-medium';
      case 'Hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-medium';
    }
  };
  return <Layout>
      <div className="challenges-container">
        <div className="challenges-header">
          <div>
            <h1 className="challenges-title">Personal Challenges</h1>
            <p className="challenges-subtitle">
              Complete challenges to earn points and badges
            </p>
          </div>
          <div className="challenges-actions">
            <div className="points-badge">
              <TrophyIcon size={20} className="points-icon" />
              <span className="points-text">Your Points: 200</span>
            </div>
            <Button icon={<PlusIcon size={16} />} onClick={createChallenge}>
              Create Challenge
            </Button>
          </div>
        </div>
        {/* Filter tabs */}
        <div className="tabs-container">
          <button onClick={() => setSelectedFilter('active')} className={`tab-button ${selectedFilter === 'active' ? 'active' : ''}`}>
            Active
          </button>
          <button onClick={() => setSelectedFilter('available')} className={`tab-button ${selectedFilter === 'available' ? 'active' : ''}`}>
            Available
          </button>
          <button onClick={() => setSelectedFilter('completed')} className={`tab-button ${selectedFilter === 'completed' ? 'active' : ''}`}>
            Completed
          </button>
          <button onClick={() => setSelectedFilter('badges')} className={`tab-button ${selectedFilter === 'badges' ? 'active' : ''}`}>
            Badges
          </button>
        </div>
        {/* Notification toast */}
        {showNotification && <div className="notification-toast">
            <div className="notification-content">
              <div className="flex items-center">
                <div className="notification-icon-container">
                  <BellIcon size={20} className="notification-icon" />
                </div>
                <div className="notification-info">
                  <h3 className="notification-title">Challenge Created!</h3>
                  <p className="notification-message">
                    Your custom challenge has been created successfully.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowNotification(false)}>
                <XIcon size={16} className="notification-close" />
              </button>
            </div>
          </div>}
        {/* Active challenges */}
        {selectedFilter === 'active' && <div className="grid grid-cols-1 gap-6">
            {activeChallenges.length === 0 ? <Card>
                <div className="empty-challenges">
                  <div className="empty-icon-container">
                    <TrophyIcon size={24} className="empty-icon" />
                  </div>
                  <h3 className="empty-title">No Active Challenges</h3>
                  <p className="empty-description">
                    You don't have any challenges in progress
                  </p>
                  <Button onClick={() => setSelectedFilter('available')}>
                    Browse Challenges
                  </Button>
                </div>
              </Card> : activeChallenges.map(challenge => <Card key={challenge.id} className="challenge-card">
                  <div className="challenge-card-content">
                    <div className="challenge-header">
                      <div className="flex items-start">
                        <div className={`challenge-icon-container bg-${challenge.color}-100`}>
                          <TrophyIcon size={20} className={`text-${challenge.color}-500`} />
                        </div>
                        <div className="challenge-info">
                          <h3 className="challenge-title">{challenge.title}</h3>
                          <p className="challenge-description">
                            {challenge.description}
                          </p>
                        </div>
                      </div>
                      <span className="challenge-status challenge-status-active">
                        In Progress
                      </span>
                    </div>
                    <div className="mt-6">
                      <ProgressBar value={challenge.progress} max={challenge.total} color={challenge.color as any} />
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          {challenge.daysLeft} days remaining
                        </span>
                        <span className="text-sm text-gray-500">
                          +{challenge.points} points on completion
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="challenge-footer">
                    <div className="challenge-reminder">
                      <div className="reminder-icon-container">
                        <BellIcon size={14} className="text-gray-600" />
                      </div>
                      <span className="reminder-text">Daily reminder set</span>
                    </div>
                    <Button size="sm" icon={<TrendingUpIcon size={14} />}>
                      Update Progress
                    </Button>
                  </div>
                </Card>)}
          </div>}
        {/* Available challenges */}
        {selectedFilter === 'available' && <div className="available-challenges-grid">
            <div className="create-challenge-card">
              <div className="create-challenge-info">
                <h3 className="create-challenge-title">
                  Create Your Own Challenge
                </h3>
                <p className="create-challenge-description">
                  Set personal goals that match your nutritional journey
                </p>
              </div>
              <Button className="bg-white text-emerald-600 hover:bg-gray-100" onClick={createChallenge}>
                Create Custom Challenge
              </Button>
            </div>
            {availableChallenges.map(challenge => <div key={challenge.id} className="available-challenge-card">
                <div className="available-challenge-header">
                  <span className={`difficulty-badge ${getDifficultyClass(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="points-text">+{challenge.points} pts</span>
                </div>
                <h3 className="available-challenge-title">{challenge.title}</h3>
                <p className="available-challenge-description">
                  {challenge.description}
                </p>
                <Button fullWidth>Start Challenge</Button>
              </div>)}
          </div>}
        {/* Completed challenges */}
        {selectedFilter === 'completed' && <Card>
            <h2  className="font-bold text-lg text-gray-800 dark:text-white -300  mb-4">
              Completed Challenges
            </h2>
            {completedChallenges.length === 0 ? <div className="empty-challenges">
                <div className="empty-icon-container">
                  <CheckIcon size={24} className="empty-icon" />
                </div>
                <h3 className="empty-title">No Completed Challenges</h3>
                <p className="empty-description">
                  Complete challenges to see them here
                </p>
              </div> : <div className="completed-challenge-list">
                {completedChallenges.map(challenge => <div key={challenge.id} className="completed-challenge-item">
                    <div className="flex items-center">
                      <div className="completed-challenge-icon-container">
                        <CheckIcon size={16} className="completed-challenge-icon" />
                      </div>
                      <div className="completed-challenge-info">
                        <h3 className="completed-challenge-title">
                          {challenge.title}
                        </h3>
                        <p className="completed-challenge-description">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                    <div className="completed-challenge-points">
                      <div className="completed-challenge-points-value">
                        +{challenge.points} pts
                      </div>
                      <p className="completed-challenge-date">
                        {challenge.completedDate}
                      </p>
                    </div>
                  </div>)}
              </div>}
          </Card>}
        {/* Badges */}
        {selectedFilter === 'badges' && <Card>
            <h2 className="font-bold text-lg text-gray-800 dark:text-white -300 mb-6">
              Your Badges
            </h2>
            <div className="badges-grid">
              {badges.map(badge => <div key={badge.id} className={`badge-card ${badge.unlocked ? 'badge-card-unlocked' : 'badge-card-locked'}`}>
                  {badge.unlocked ? <div className="badge-icon-container">
                      <span>{badge.image}</span>
                    </div> : <div className="badge-lock-container">
                      <LockIcon size={24} className="badge-lock-icon" />
                    </div>}
                  <h3 className="badge-title">{badge.name}</h3>
                  <p className="badge-description">{badge.description}</p>
                  {!badge.unlocked && <div className="badge-unlock-info">
                      <button className="badge-unlock-button">
                        How to earn
                      </button>
                    </div>}
                </div>)}
            </div>
            <div className="badges-info-box">
              <p className="badges-info-title">
                Badges represent your achievements on your nutritional journey
              </p>
              <p className="badges-info-description">
                Complete challenges and maintain streaks to unlock more badges
              </p>
            </div>
          </Card>}
      </div>
    </Layout>;
};
export default Challenges;

