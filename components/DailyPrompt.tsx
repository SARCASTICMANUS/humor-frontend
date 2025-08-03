import React, { useState, useEffect } from 'react';
import { getDailyHumorPrompt } from '../services/geminiService';
import Icon from './Icon';

const DailyHumorChallenge: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Summoning a witty thought...');

  useEffect(() => {
    const fetchPrompt = async () => {
      const dailyPrompt = await getDailyHumorPrompt();
      setPrompt(dailyPrompt);
    };
    fetchPrompt();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-5 mb-8 shadow-sharp dark:shadow-sharp-dark rounded-xl">
      <div className="flex items-start gap-4">
        <Icon name="swords" className="w-8 h-8 text-brand-500 mt-1 flex-shrink-0" />
        <div>
            <h2 className="text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
                Daily Humor Dose
            </h2>
            <p className="text-lg text-gray-800 dark:text-gray-200 font-serif font-medium mt-1">
                {prompt}
            </p>
        </div>
      </div>
    </div>
  );
};

export default DailyHumorChallenge;