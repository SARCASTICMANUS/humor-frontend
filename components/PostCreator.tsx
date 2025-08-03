
import React, { useState, useEffect, useRef } from 'react';
import { HumorCategory, User } from '../types';
import Icon from './Icon';
import { BANNED_WORDS, CATEGORIES } from '../constants';

interface PostCreatorProps {
  currentUser: User;
  onNewPost: (postData: { text: string; category: string; isAnonymous: boolean; }) => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ currentUser, onNewPost }) => {
  const [category, setCategory] = useState<HumorCategory | ''>('');
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const maxChars = 200;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!category || text.trim() === '' || isSubmitting) return;

    const containsBannedWord = BANNED_WORDS.some(word => text.toLowerCase().includes(word));
    if (containsBannedWord) {
      setError("Content contains flagged words. Please revise.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await onNewPost({ text, category, isAnonymous });
      setText('');
      setCategory('');
      setIsAnonymous(false);
    } catch (err) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isButtonDisabled = !category || text.trim() === '' || isSubmitting;
  const buttonText = isSubmitting ? 'Unleashing...' : 'Unleash';

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-4 mb-8 shadow-sharp dark:shadow-sharp-dark rounded-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HumorCategory)}
            className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-brand-500 font-semibold transition-colors"
          >
            <option value="" disabled className="text-gray-400 dark:text-gray-500">-- Select a Humor Category --</option>
            {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 dark:text-gray-500">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Unburden your mind with something witty. Or just complain. We don't judge."
          className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-lg resize-none focus:outline-none rounded-lg focus:border-brand-500 focus:caret-brand-500 transition-colors font-serif"
          rows={3}
          maxLength={maxChars}
        />

        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
        
        <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer select-none font-semibold">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 appearance-none border-2 border-gray-400 dark:border-gray-500 checked:bg-brand-500 checked:border-brand-500 rounded-sm"
              />
              Hide my shame (Anonymous)
            </label>
            <span className={`text-sm font-medium ${text.length > maxChars - 20 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
              {text.length}/{maxChars}
            </span>
        </div>
      
        <div className="flex justify-end items-center mt-2">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`bg-brand-500 text-gray-900 font-bold py-2 px-5 border-2 border-gray-900 rounded-lg transition-all duration-200
              hover:bg-brand-600 active:translate-y-px active:translate-x-px
              ${isSubmitting ? 'bg-gray-400' : ''}
              ${isButtonDisabled ? 'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400' : ''}
            `}
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;
