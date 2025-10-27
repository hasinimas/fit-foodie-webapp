import React, { useState } from 'react';
import { MessageCircleIcon, MicIcon, SendIcon } from 'lucide-react';
interface MoodTrackerProps {
  onSubmitMood: (mood: string) => void;
  aiResponse?: string;
  isLoading?: boolean;
}
const MoodTracker: React.FC<MoodTrackerProps> = ({
  onSubmitMood,
  aiResponse = '',
  isLoading = false
}) => {
  const [mood, setMood] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmitMood(mood);
      setMood('');
    }
  };
  const moodEmojis = [{
    emoji: '😊',
    label: 'Happy'
  }, {
    emoji: '😐',
    label: 'Neutral'
  }, {
    emoji: '😔',
    label: 'Sad'
  }, {
    emoji: '😡',
    label: 'Angry'
  }, {
    emoji: '😴',
    label: 'Tired'
  }];
 return (
  <div className="
    bg-gradient-to-br from-emerald-50 to-white-100 dark:from-gray-900 dark:to-gray-850
    rounded-xl shadow-lg border border-emerald-100 dark:border-gray-700 backdrop-blur-md overflow-hidden
    hover:shadow-emerald-200 hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-800 dark:text-white flex items-center text-lg">
        <MessageCircleIcon size={20} className="mr-2 text-emerald-500" />
        AI Mood Check
      </h3>
    </div>

    <div className="p-5">
      <div className="mb-4 flex justify-between">
        {moodEmojis.map(item => (
          <button
            key={item.label}
            onClick={() => setMood(`I'm feeling ${item.label.toLowerCase()} today`)}
            className="flex flex-col items-center group px-2 py-1"
          >
            <div className="text-3xl mb-1 transition-all duration-300 group-hover:scale-150 group-hover:-translate-y-1">
              {item.emoji}
            </div>
            <span className="text-md text-gray-600 dark:text-gray-300 transition-all duration-300 
              group-hover:text-emerald-500 group-hover:font-bold"
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          How are you feeling today? Your mood affects your nutrition needs.
        </p>

        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="Type how you're feeling..."
            className="flex-1 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/50 
            text-gray-900 dark:text-white placeholder:text-gray-400 
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />

          <button
            type="submit"
            className="bg-emerald-500 text-white rounded-r-lg px-4 flex items-center justify-center
            hover:bg-emerald-600 transition-all duration-300 active:scale-95"
            disabled={!mood.trim()}
          >
            <SendIcon size={18} />
          </button>
        </form>
      </div>

      {(aiResponse || isLoading) && (
        <div className="p-4 bg-white-500 dark:bg-white-900/40 rounded-lg border-l-4 border-green-500">
          <div className="flex items-start">
            <div className="h-10 w-10 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
              <span className="font-bold text-green-600 dark:text-green-300">AI</span>
            </div>

            <div>
              {isLoading ? (
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              ) : (
                <>
                  <p className="text-gray-800 dark:text-gray-200">{aiResponse}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Based on your mood, I've adjusted today's recommendations.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

};
export default MoodTracker;

