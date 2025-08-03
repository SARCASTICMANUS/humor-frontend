import React, { useState } from 'react';
import { HumorTag } from '../../types';
import Icon from '../Icon';

interface SignupProps {
  onSignup: (handle: string, pass: string, tag: HumorTag) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [humorTag, setHumorTag] = useState<HumorTag>(HumorTag.Sarcastic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle && password) {
      onSignup(handle, password, humorTag);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-8 max-w-md w-full shadow-sharp dark:shadow-sharp-dark rounded-xl">
      <div className="flex justify-center mb-6 items-center gap-3">
        <img src="/humor.png" alt="Humor Logo" className="w-12 h-12" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tighter">Join the Misery</h2>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-serif">Sell your soul for a fleeting moment of internet validation.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="handle-signup" className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Handle</label>
          <input
            id="handle-signup"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Your future regret"
            className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:border-brand-500 dark:text-gray-200 font-sans"
            required
          />
        </div>
        <div>
          <label htmlFor="password-signup"  className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Password</label>
          <input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Something you'll forget"
            className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:border-brand-500 dark:text-gray-200 font-sans"
            required
          />
        </div>
        <div>
            <label htmlFor="humor-tag" className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Your Flavor of Funny</label>
            <div className="relative">
                <select
                    id="humor-tag"
                    value={humorTag}
                    onChange={(e) => setHumorTag(e.target.value as HumorTag)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg px-3 py-3 appearance-none focus:outline-none focus:border-brand-500 font-semibold font-sans"
                >
                    {Object.values(HumorTag).map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 dark:text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
        <button
          type="submit"
          className="w-full bg-brand-500 text-gray-900 font-bold py-3 px-5 border-2 border-gray-900 rounded-lg transition-all duration-200 hover:bg-brand-600 active:translate-y-px active:translate-x-px"
        >
          Embrace the Void
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already a member of this circus?{' '}
          <button onClick={onSwitchToLogin} className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Log In.
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;