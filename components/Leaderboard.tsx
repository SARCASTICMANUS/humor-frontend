import React, { useState, useMemo } from 'react';
import { User, Post, LeaderboardCategory, LeaderboardTimeframe } from '../types';
import { getUserHumorScore, getUserLevel } from '../constants';

interface LeaderboardProps {
  users: User[];
  posts: Post[];
  onProfileClick: (user: User) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, posts, onProfileClick }) => {
  const [category, setCategory] = useState<LeaderboardCategory>('Top Humorists');
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('All-Time');

  const leaderboardData = useMemo(() => {
    // Note: In a real app, filtering by timeframe and calculating scores
    // for different categories would be a complex backend query.
    // Here we simplify and primarily use the 'Top Humorists' logic.
    return users
      .map(user => ({
        user,
        score: getUserHumorScore(user.id, posts),
      }))
      .filter(data => data.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [users, posts, category, timeframe]);

  const getTrophyColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-slate-400';
    if (rank === 2) return 'text-orange-500';
    return 'text-gray-400 dark:text-gray-500';
  };

  const TabButton: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick}) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-semibold border-2 transition-colors rounded-full ${
        active
          ? 'bg-brand-500 text-gray-900 border-brand-500'
          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-800 hover:text-gray-800 dark:hover:border-gray-300 dark:hover:text-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-4 sm:p-6 shadow-sharp dark:shadow-sharp-dark rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">The Hierarchy of Hilarity</h2>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {(['Daily', 'Weekly', 'All-Time'] as LeaderboardTimeframe[]).map(tf => (
            <TabButton key={tf} label={tf} active={timeframe === tf} onClick={() => setTimeframe(tf)} />
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {leaderboardData.length > 0 ? leaderboardData.map(({ user, score }, index) => (
          <div key={user.id} className="flex items-center gap-2 sm:gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl">
            <span className={`w-6 sm:w-8 text-center text-lg sm:text-xl font-bold ${getTrophyColor(index)}`}>{index + 1}</span>
            <img
              src={user.profilePicUrl || `https://picsum.photos/seed/${user.id}/100/100`}
              alt={user.handle}
              className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded-full object-cover"
              onClick={() => onProfileClick(user)}
            />
            <div className="flex-grow min-w-0">
              <p 
                className="font-bold text-gray-800 dark:text-gray-200 cursor-pointer hover:underline truncate text-sm sm:text-base"
                onClick={() => onProfileClick(user)}
              >
                {user.handle}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{getUserLevel(score)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-brand-600 dark:text-brand-400 text-base sm:text-lg">{score.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-semibold hidden sm:block">Aura</p>
            </div>
          </div>
        )) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                <p className="text-lg font-serif text-gray-600 dark:text-gray-400">It appears no one is funny today.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">A tragedy.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;