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
  return <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-800 flex items-center">
          <MessageCircleIcon size={18} className="mr-2 text-emerald-500" />
          AI Mood Check
        </h3>
      </div>
      <div className="p-5">
        <div className="mb-4 flex justify-between">
          {moodEmojis.map(item => <button key={item.label} onClick={() => setMood(`I'm feeling ${item.label.toLowerCase()} today`)} className="flex flex-col items-center">
              <div className="text-2xl mb-1 hover:transform hover:scale-125 transition-transform">
                {item.emoji}
              </div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </button>)}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <p className="text-gray-600 mb-3">
            How are you feeling today? Your mood affects your nutrition needs.
          </p>
          <form onSubmit={handleSubmit} className="flex">
            <input type="text" value={mood} onChange={e => setMood(e.target.value)} placeholder="Type how you're feeling..." className="flex-1 rounded-l-lg border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
            <button type="button" className="bg-gray-100 text-gray-500 px-3 flex items-center justify-center border-y border-gray-300">
              <MicIcon size={18} />
            </button>
            <button type="submit" className="bg-emerald-500 text-white rounded-r-lg px-4 flex items-center justify-center hover:bg-emerald-600 transition-colors" disabled={!mood.trim()}>
              <SendIcon size={18} />
            </button>
          </form>
        </div>
        {(aiResponse || isLoading) && <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="font-bold text-blue-600">AI</span>
              </div>
              <div>
                {isLoading ? <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{
                animationDelay: '0.2s'
              }}></div>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{
                animationDelay: '0.4s'
              }}></div>
                  </div> : <>
                    <p className="text-gray-800">{aiResponse}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on your mood, I've adjusted today's recommendations.
                    </p>
                  </>}
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default MoodTracker;