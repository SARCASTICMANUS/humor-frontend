import React, { useState } from 'react';
import Icon from '../Icon';

interface LoginProps {
  onLogin: (handle: string, pass: string) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle && password) {
      onLogin(handle, password);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-8 max-w-md w-full shadow-sharp dark:shadow-sharp-dark rounded-xl">
      <div className="flex justify-center mb-6 items-center gap-3">
        <img src="/humor.png" alt="Humor Logo" className="w-12 h-12" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tighter">Welcome Back</h2>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-serif">You must be desperate to come back here.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="handle" className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Handle</label>
          <input
            id="handle"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Your witty alias"
            className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:border-brand-500 dark:text-gray-200 font-sans"
            required
          />
        </div>
        <div>
          <label htmlFor="password"  className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Don't use 'password', have some self-respect"
            className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:border-brand-500 dark:text-gray-200 font-sans"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-500 text-gray-900 font-bold py-3 px-5 border-2 border-gray-900 rounded-lg transition-all duration-200 hover:bg-brand-600 active:translate-y-px active:translate-x-px"
        >
          Let Me In
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          First time suffering here?{' '}
          <button onClick={onSwitchToSignup} className="font-bold text-brand-600 hover:underline dark:text-brand-400">
            Sign Up, I guess.
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;