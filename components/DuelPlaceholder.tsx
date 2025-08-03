import React from 'react';
import Icon from './Icon';

const DuelPlaceholder: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-8 text-center shadow-sharp dark:shadow-sharp-dark rounded-xl">
      <div className="flex justify-center mb-4">
        <Icon name="swords" className="w-16 h-16 text-brand-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 tracking-tight">The Roast Arena</h2>
      <p className="text-lg font-semibold text-brand-600 dark:text-brand-400 mb-4">(Coming whenever we feel like it)</p>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        A place for verbal gladiators to prove their wit. Sharpen your tongue, the arena awaits your glorious, sarcastic comeback. Or your epic failure. We're here for both.
      </p>
      <p className="text-gray-400 dark:text-gray-500 mt-6 text-sm font-semibold">Patience is a virtue we're currently testing.</p>
    </div>
  );
};

export default DuelPlaceholder;