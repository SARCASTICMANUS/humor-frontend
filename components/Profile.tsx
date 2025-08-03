import React from 'react';
import { Post, User } from '../types';
import { calculateHumorScore, getUserHumorScore, getUserLevel } from '../constants';
import PostCard from './PostCard';
import Icon, { IconName } from './Icon';

interface ProfileProps {
  user: User;
  posts: Post[];
  currentUser: User;
  onClose: () => void;
  onProfileClick: (user: User) => void;
  onNewReply: (postId: string, parentCommentId: string | null, text: string) => void;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (postId: string, updatedPost: Post) => void;
}

const generateBannerSVG = (seed: string) => {
  const hash = Array.from(seed).reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  
  const shapes = [];
  const color = '#eab308' // brand-500, works on both light and dark
  
  for (let i = 0; i < 20; i++) {
    const x = Math.abs((hash ^ (i*39)) % 100);
    const y = Math.abs((hash ^ (i*57)) % 100);
    const size = Math.abs((hash ^ (i*71))) % 2 + 0.5;
    const opacity = (Math.abs((hash ^ (i*89))) % 5 + 2) / 20; // 0.1 - 0.3
    shapes.push(`<circle cx="${x}%" cy="${y}%" r="${size}" fill="${color}" fill-opacity="${opacity}" />`);
  }
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
    ${shapes.join('')}
  </svg>`;
  
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};


const InfoCard: React.FC<{icon: IconName, label: string, value: string, valueClass: string}> = ({ icon, label, value, valueClass }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex items-center gap-4 transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-default">
    <div className="bg-white dark:bg-gray-800 p-3 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm">
      <Icon name={icon} className="w-6 h-6 text-gray-400 dark:text-gray-500" />
    </div>
    <div className="text-left">
      <p className={`text-2xl font-bold ${valueClass}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ user, posts, currentUser, onClose, onProfileClick, onNewReply, onDeletePost, onUpdatePost }) => {
  const userPosts = posts
    .filter(p => p.author.id === user.id && !p.isAnonymous)
    .sort((a, b) => calculateHumorScore(b) - calculateHumorScore(a));
  
  const humorScore = getUserHumorScore(user.id, posts);
  const userLevel = getUserLevel(humorScore);

  const bannerStyle = {
    backgroundImage: generateBannerSVG(user.id),
    backgroundSize: 'cover',
  };

  return (
    <div className="w-full">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 mb-8 relative shadow-sharp dark:shadow-sharp-dark rounded-xl">
         <div className="p-4 sm:p-6 relative">
           <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-2 border-gray-900 dark:border-gray-100 text-gray-800 dark:text-gray-100 hover:bg-white/80 dark:hover:bg-black/40 transition-colors rounded-full z-10">
             <Icon name="x" className="w-5 h-5" />
           </button>
                       <div className="flex flex-col items-center text-center">
              <div className="p-1 sm:p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-lg flex-shrink-0">
                <img
                  src={user.profilePicUrl || `https://picsum.photos/seed/${user.id}/100/100`}
                  alt={user.handle}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                />
              </div>
              <div className="mt-2">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user.handle}</h2>
                <p className="text-md text-brand-600 dark:text-brand-400 font-semibold">{userLevel}</p>
              </div>
            </div>
          
          <p className="text-gray-600 dark:text-gray-400 font-serif italic mt-5 border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-5 text-center sm:text-left">{user.bio || 'Bio? I\'m supposed to summarize my entire being in a tiny box? No thanks.'}</p>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard 
                icon="award"
                label="Total Aura"
                value={humorScore.toLocaleString()}
                valueClass="text-brand-600 dark:text-brand-400"
              />
              <InfoCard
                icon="tag"
                label="Humor Style"
                value={`#${user.humorTag}`}
                valueClass="text-gray-700 dark:text-gray-300"
              />
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">Their "Greatest" Hits</h3>
      <div className="space-y-8">
        {userPosts.length > 0 ? userPosts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser} 
            onProfileClick={onProfileClick} 
            onNewReply={onNewReply}
            onDeletePost={onDeletePost}
            onUpdatePost={onUpdatePost}
            showDeleteButton={currentUser.id === user.id}
            showEditButton={currentUser.id === user.id}
          />
        )) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                <p className="text-lg font-serif text-gray-600 dark:text-gray-400">{user.handle} is in their silent, mysterious phase.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Or they just have nothing funny to say.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;