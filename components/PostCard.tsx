
import React, { useState, useRef, useEffect } from 'react';
import { Post, ReactionType, User, Reaction, Comment } from '../types';
import { calculateHumorScore, REACTION_POINTS } from '../constants';
import Icon, { IconName } from './Icon';
import Tooltip from './Tooltip';
import * as api from '../services/api';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onProfileClick: (user: User) => void;
  onNewReply: (postId: string, parentCommentId: string | null, text: string) => void;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (postId: string, updatedPost: Post) => void;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
}

const formatTimeAgo = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return "now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

const reactionIconMapping: Record<ReactionType, IconName> = {
    'Amused': 'laugh',
    'Clever': 'lightbulb',
    '...Wow': 'meh',
};

const ReactionChip: React.FC<{
  type: ReactionType;
  iconName: IconName;
  reaction: Reaction;
  points: number;
  onClick: () => void;
  isActive: boolean;
}> = ({ type, iconName, reaction, points, onClick, isActive }) => {
  const count = reaction?.users?.length || 0;
  return (
    <Tooltip text={`${type}: ${points} point${points !== 1 ? 's' : ''}`}>
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-0.5 w-12 sm:w-14 text-center"
        aria-label={`${type}: ${count}`}
      >
        <div className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors ${isActive ? 'bg-brand-500/20' : 'bg-gray-200/60 hover:bg-gray-300 dark:bg-gray-700/60 dark:hover:bg-gray-600'}`}>
          {isActive && <div className="absolute inset-0 rounded-full border-2 border-brand-500 animate-pulse"></div>}
          <Icon name={iconName} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`} />
        </div>
        <span className={`text-[10px] sm:text-xs font-semibold transition-colors ${isActive ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>{type}</span>
        <span className={`text-[10px] sm:text-xs font-bold tabular-nums transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'}`}>{count.toLocaleString()}</span>
      </button>
    </Tooltip>
  );
};


// --- Reply Form Component ---
const ReplyForm: React.FC<{ 
    currentUser: User; 
    replyText: string;
    onReplyTextChange: (text: string) => void;
    onSubmit: () => void; 
    onCancel: () => void;
}> = ({ currentUser, replyText, onReplyTextChange, onSubmit, onCancel }) => (
    <div className="mt-3">
        <div className="flex items-start gap-3">
            <img
            src={currentUser.profilePicUrl || `https://picsum.photos/seed/${currentUser.id}/100/100`}
            alt="Your profile"
            className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
            />
            <div className="flex-grow">
            <textarea
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                placeholder="Drop your witty reply..."
                className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 p-2 text-sm rounded-lg focus:outline-none focus:border-brand-500 dark:text-gray-200 resize-none transition-colors focus:caret-brand-500"
                rows={2}
                maxLength={280}
                autoFocus
            />
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">{replyText.length}/280</span>
                <div className="flex items-center gap-2">
                <button
                    onClick={onCancel}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-1.5 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                >
                    Send
                </button>
                </div>
            </div>
            </div>
        </div>
   </div>
);


// --- Comment View Component ---
const CommentView: React.FC<{ 
    comment: Comment; 
    onProfileClick: (user: User) => void;
    viewMode: 'preview' | 'full';
    onReplyClick: (commentId: string) => void;
    onViewThreadClick: (comment: Comment) => void;
    replyingToId: string | null;
    replyForm: React.ReactNode;
}> = ({ comment, onProfileClick, viewMode, onReplyClick, onViewThreadClick, replyingToId, replyForm }) => {
    const isPreview = viewMode === 'preview';
    const hasReplies = comment.replies && comment.replies.length > 0;

    const handleCardClick = () => {
        if (isPreview && hasReplies) {
            onViewThreadClick(comment);
        }
    };

    const handleReplyButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReplyClick(comment.id);
    };

    const handleViewRepliesClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewThreadClick(comment);
    };
    
    const cardClasses = "bg-white dark:bg-gray-800/50 p-3 rounded-lg";

    return (
        <div className="relative pl-5">
            <div className="absolute left-2.5 -top-3 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
             <div className="absolute left-0 top-4 h-0.5 w-2.5 bg-gray-200 dark:bg-gray-700"></div>
            
            <div className={`${cardClasses} ${isPreview && hasReplies ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`} onClick={handleCardClick}>
                <div className="flex items-start gap-3">
                     <img
                        src={comment.author.profilePicUrl || `https://picsum.photos/seed/${comment.author.id}/100/100`}
                        alt={comment.author.handle}
                        className="w-8 h-8 cursor-pointer rounded-full object-cover"
                        onClick={(e) => { e.stopPropagation(); onProfileClick(comment.author); }}
                    />
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="font-bold text-sm text-gray-800 dark:text-gray-200 cursor-pointer hover:underline"
                                    onClick={(e) => { e.stopPropagation(); onProfileClick(comment.author); }}
                                >
                                    {comment.author.handle}
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">· {formatTimeAgo(comment.timestamp)}</span>
                            </div>
                            <button onClick={e => e.stopPropagation()} className="p-1 text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 rounded-full">
                                <Icon name="more-horizontal" className="w-4 h-4"/>
                            </button>
                        </div>
                        <p className="text-md text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.text}</p>
                        <div className="mt-2 flex justify-between items-center">
                            {isPreview && hasReplies ? (
                                <button onClick={handleViewRepliesClick} className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                                    View {comment.replies.length} more {comment.replies.length > 1 ? 'replies' : 'reply'}
                                </button>
                            ) : <div />}
                            <Tooltip text="Humor Drop">
                                <button 
                                    onClick={handleReplyButtonClick} 
                                    className="p-1 text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 rounded-full transition-colors"
                                    aria-label="Humor Drop"
                                >
                                    <Icon name="raccoon" className="w-5 h-5"/>
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            
            {replyingToId === comment.id && replyForm}

            {!isPreview && hasReplies && (
                <div className="mt-3 space-y-3">
                    {comment.replies
                        .sort((a, b) => {
                            const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
                            const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
                            return timeB.getTime() - timeA.getTime();
                        })
                        .map(reply => (
                        <CommentView 
                            key={reply.id} 
                            comment={reply} 
                            onProfileClick={onProfileClick}
                            viewMode="full"
                            onReplyClick={onReplyClick}
                            onViewThreadClick={onViewThreadClick}
                            replyingToId={replyingToId}
                            replyForm={replyForm}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Thread Modal Component ---
const ThreadModal: React.FC<{
    rootComment: Comment;
    onClose: () => void;
    replyingToId: string | null;
    replyForm: React.ReactNode;
    onReplyClick: (commentId: string) => void;
    onProfileClick: (user: User) => void;
}> = ({ rootComment, onClose, replyingToId, replyForm, onReplyClick, onProfileClick }) => {
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start p-4 pt-16 sm:pt-24" onClick={onClose}>
            <div className="bg-[#F8F7F4] dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-xl shadow-lg" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-[#F8F7F4]/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Thread</h3>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                        <Icon name="x" className="w-5 h-5"/>
                    </button>
                </div>
                
                <div className="p-4">
                    <CommentView
                        comment={rootComment}
                        onProfileClick={onProfileClick}
                        viewMode="full"
                        onReplyClick={onReplyClick}
                        onViewThreadClick={() => {}} // No-op inside modal
                        replyingToId={replyingToId}
                        replyForm={replyForm}
                    />
                </div>
            </div>
        </div>
    );
};

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onProfileClick, onNewReply, onDeletePost, onUpdatePost, showDeleteButton = false, showEditButton = false }) => {
  const [localPost, setLocalPost] = useState(post);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [viewingThread, setViewingThread] = useState<Comment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [editCategory, setEditCategory] = useState(post.category);
  const [editIsAnonymous, setEditIsAnonymous] = useState(post.isAnonymous);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const handleReactionClick = async (type: ReactionType) => {
    const currentReaction = localPost.reactions.find(r => r.users.includes(currentUser.id));
    
    // Optimistic update
    const newLocalPost = JSON.parse(JSON.stringify(localPost));
    
    // Remove previous reaction if it exists
    if(currentReaction) {
        const prevReactionObj = newLocalPost.reactions.find(r => r.type === currentReaction.type);
        if(prevReactionObj) {
            prevReactionObj.users = prevReactionObj.users.filter(uid => uid !== currentUser.id);
        }
    }

    // Add new reaction if it's different from the previous one
    if(currentReaction?.type !== type) {
        let newReactionObj = newLocalPost.reactions.find(r => r.type === type);
        if (newReactionObj) {
            newReactionObj.users.push(currentUser.id);
        } else {
            newLocalPost.reactions.push({ type, users: [currentUser.id] });
        }
    }
    setLocalPost(newLocalPost);

    try {
      await api.apiReactToPost(post.id, type);
    } catch (error) {
      console.error("Failed to react to post", error);
      // Revert optimistic update on failure
      setLocalPost(post);
      alert("Failed to save reaction.");
    }
  };
  
  const handleReplySubmit = async () => {
    if (replyText.trim() && replyingToId) {
      const parentCommentId = replyingToId === post.id ? null : replyingToId;
      await onNewReply(post.id, parentCommentId, replyText);
      setReplyText('');
      setReplyingToId(null);
    }
  };
  
  const handleReplyClick = (id: string) => {
    setReplyingToId(currentId => (currentId === id ? null : id));
    setReplyText('');
  }

  const handleEditPost = async () => {
    if (!onUpdatePost) return;
    
    try {
      const updatedPost = await api.apiUpdatePost(post.id, {
        text: editText,
        category: editCategory,
        isAnonymous: editIsAnonymous
      });
      
      setLocalPost(updatedPost);
      onUpdatePost(post.id, updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleDeletePost = async () => {
    if (!onDeletePost) return;
    
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.apiDeletePost(post.id);
        onDeletePost(post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };
  
  const replyFormComponent = (
    <ReplyForm 
        currentUser={currentUser} 
        replyText={replyText} 
        onReplyTextChange={setReplyText}
        onSubmit={handleReplySubmit}
        onCancel={() => setReplyingToId(null)} 
    />
  );

  const totalScore = calculateHumorScore(localPost);
  const authorHandle = post.isAnonymous ? 'Anonymous' : post.author.handle;
  const authorProfilePic = post.isAnonymous ? 'https://picsum.photos/seed/anon/100/100' : post.author.profilePicUrl;
  const userReaction = localPost.reactions.find(r => r.users.includes(currentUser.id));

  return (
    <>
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-100 p-4 sm:p-5 flex flex-col rounded-xl shadow-sharp dark:shadow-sharp-dark">
          <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full">{post.category}</span>
              <div className="flex items-center gap-2">


                <Tooltip text="Humor Drop">
                  <button 
                    onClick={() => handleReplyClick(post.id)} 
                    className="p-1 text-gray-400 hover:text-brand-500 dark:text-gray-500 dark:hover:text-brand-400 rounded-full transition-colors"
                    aria-label="Humor Drop"
                  >
                      <Icon name="raccoon" className="w-6 h-6"/>
                  </button>
                </Tooltip>
              </div>
          </div>

          {isEditing ? (
            <div className="my-4 space-y-4">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-serif text-xl sm:text-2xl resize-none focus:outline-none focus:border-brand-500"
                rows={3}
                placeholder="Edit your humor..."
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="px-3 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
                >
                  <option value="Tech & Geek Humor">Tech & Geek Humor</option>
                  <option value="Office & College Life">Office & College Life</option>
                  <option value="Relationship & Dating Humor">Relationship & Dating Humor</option>
                  <option value="Roasts & Burns">Roasts & Burns</option>
                  <option value="Political Satire">Political Satire</option>
                  <option value="Random & Toilet Humor">Random & Toilet Humor</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={editIsAnonymous}
                    onChange={(e) => setEditIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  Post anonymously
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditPost}
                  className="px-4 py-2 bg-brand-500 text-gray-900 font-semibold rounded-lg hover:bg-brand-400 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(post.text);
                    setEditCategory(post.category);
                    setEditIsAnonymous(post.isAnonymous);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="font-serif text-xl sm:text-2xl text-gray-800 dark:text-gray-100 my-4 flex-grow break-words">{post.text}</p>
          )}
          
          <div className="flex flex-row gap-2 items-center justify-between mt-auto pt-4 border-t-2 border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 flex-shrink-0">
                <img
                    src={authorProfilePic || `https://picsum.photos/seed/${post.author.id}/100/100`}
                    alt="profile"
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 ${!post.isAnonymous && 'cursor-pointer'} rounded-full object-cover`}
                    onClick={() => !post.isAnonymous && onProfileClick(post.author)}
                />
                <div className="flex-grow">
                     <h3 
                        className={`font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 ${!post.isAnonymous && 'cursor-pointer hover:underline'}`}
                        onClick={() => !post.isAnonymous && onProfileClick(post.author)}
                    >
                        {authorHandle}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{totalScore.toLocaleString()}</span> aura &middot; {formatTimeAgo(post.createdAt || post.timestamp)}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-1 w-full">
                {(['Amused', 'Clever', '...Wow'] as ReactionType[]).map((type) => {
                    const reaction = localPost.reactions.find(r => r.type === type);
                    return (
                        <ReactionChip 
                            key={type}
                            type={type}
                            iconName={reactionIconMapping[type]}
                            reaction={reaction}
                            points={REACTION_POINTS[type]}
                            onClick={() => handleReactionClick(type)}
                            isActive={userReaction?.type === type} 
                        />
                    );
                })}
            </div>
          </div>
        </div>

        {(post.comments.length > 0 || replyingToId === post.id) && (
            <div className="mt-4 pl-4 sm:pl-6 space-y-3">
                {replyingToId === post.id && replyFormComponent}
                {post.comments
                    .sort((a, b) => {
                        const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp) : a.timestamp;
                        const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp) : b.timestamp;
                        return timeB.getTime() - timeA.getTime();
                    })
                    .map((comment) => (
                  <CommentView 
                    key={comment.id}
                    comment={comment}
                    onProfileClick={onProfileClick}
                    viewMode="preview"
                    onReplyClick={handleReplyClick}
                    onViewThreadClick={setViewingThread}
                    replyingToId={replyingToId}
                    replyForm={replyFormComponent}
                  />
                ))}
            </div>
        )}

        {viewingThread && (
            <ThreadModal 
                rootComment={viewingThread}
                onClose={() => setViewingThread(null)}
                replyingToId={replyingToId}
                replyForm={replyFormComponent}
                onReplyClick={handleReplyClick}
                onProfileClick={onProfileClick}
            />
        )}
    </>
  );
};

export default PostCard;
