import React, { useState } from 'react';
import { Post, User, HumorCategory } from '../types';
import PostCard from './PostCard';
import PostCreator from './PostCreator';
import DailyHumorChallenge from './DailyPrompt';
import { calculateHumorScore, CATEGORIES } from '../constants';
import Icon, { IconName } from './Icon';

interface FeedProps {
  posts: Post[];
  currentUser: User;
  onNewPost: (post: Post) => void;
  onProfileClick: (user: User) => void;
  onNewReply: (postId: string, parentCommentId: string | null, text: string) => void;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (postId: string, updatedPost: Post) => void;
}

type SortType = '🔥 Hot' | '🆕 New' | '⚡️ Top Today';

const Feed: React.FC<FeedProps> = ({ posts, currentUser, onNewPost, onProfileClick, onNewReply, onDeletePost, onUpdatePost }) => {
  const [activeSort, setActiveSort] = useState<SortType>('🔥 Hot');
  const [activeCategory, setActiveCategory] = useState<HumorCategory | 'All'>('All');

  const sortPosts = (postsToSort: Post[]): Post[] => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Helper function to get the timestamp safely
    const getPostTime = (post: Post): Date => {
      if (post.timestamp) {
        return typeof post.timestamp === 'string' ? new Date(post.timestamp) : post.timestamp;
      }
      if (post.createdAt) {
        return typeof post.createdAt === 'string' ? new Date(post.createdAt) : post.createdAt;
      }
      return new Date();
    };
    
    switch (activeSort) {
      case '🆕 New':
        return [...postsToSort].sort((a, b) => getPostTime(b).getTime() - getPostTime(a).getTime());
      case '⚡️ Top Today':
        return [...postsToSort]
            .filter(p => getPostTime(p) > twentyFourHoursAgo)
            .sort((a,b) => calculateHumorScore(b) - calculateHumorScore(a));
      case '🔥 Hot':
      default:
        // A simple hot sort algorithm: score divided by age factor
        return [...postsToSort].sort((a, b) => {
            const scoreA = calculateHumorScore(a) / Math.pow((Date.now() - getPostTime(a).getTime()) / 3600000 + 2, 1.8);
            const scoreB = calculateHumorScore(b) / Math.pow((Date.now() - getPostTime(b).getTime()) / 3600000 + 2, 1.8);
            return scoreB - scoreA;
        });
    }
  };

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const sortedPosts = sortPosts(filteredPosts);

  const ControlButton: React.FC<{ label: string, active: boolean, onClick: () => void, icon?: IconName }> = ({ label, active, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border-2 transition-colors rounded-full ${
        active
          ? 'bg-brand-500 text-gray-900 border-brand-500'
          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-800 hover:text-gray-800 dark:hover:border-gray-300 dark:hover:text-gray-100'
      }`}
    >
      {icon && <Icon name={icon} className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <div className="w-full">
      <DailyHumorChallenge />
      <PostCreator currentUser={currentUser} onNewPost={onNewPost} />
      
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 rounded-xl p-3 mb-8 shadow-sharp dark:shadow-sharp-dark">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            <ControlButton label="All" active={activeCategory === 'All'} onClick={() => setActiveCategory('All')} />
            {CATEGORIES.map(cat => (
              <ControlButton key={cat.name} label={cat.name} icon={cat.icon} active={activeCategory === cat.name} onClick={() => setActiveCategory(cat.name)} />
            ))}
        </div>
         <div className="flex items-center gap-2 mt-3 border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-3">
            {(['🔥 Hot', '🆕 New', '⚡️ Top Today'] as SortType[]).map(sortType => (
                <ControlButton key={sortType} label={sortType} active={activeSort === sortType} onClick={() => setActiveSort(sortType)} />
            ))}
        </div>
      </div>


      <div className="space-y-8">
        {sortedPosts.length > 0 ? sortedPosts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser}
            onProfileClick={onProfileClick} 
            onNewReply={onNewReply}
            onDeletePost={onDeletePost}
            onUpdatePost={onUpdatePost}
            showDeleteButton={false}
            showEditButton={false}
          />
        )) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                <p className="text-lg font-serif text-gray-600 dark:text-gray-400">Wow, such empty.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">A blank canvas for your questionable humor.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Feed;