
export enum HumorCategory {
  Roasts = 'Roasts & Burns',
  Dating = 'Relationship & Dating Humor',
  Tech = 'Tech & Geek Humor',
  Life = 'Office & College Life',
  Political = 'Political Satire',
  Random = 'Random & Toilet Humor',
}

export enum HumorTag {
  Sarcastic = 'Sarcastic',
  Dark = 'Dark',
  Wholesome = 'Wholesome',
  Dry = 'Dry',
  GenZ = 'Gen Z',
  Savage = 'Savage',
  Punny = 'Punny'
}

export type ReactionType = 'Amused' | 'Clever' | '...Wow';

// Updated to match backend model
export interface Reaction {
  type: ReactionType;
  users: string[]; // Array of user IDs
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  reactions: Reaction[];
  timestamp: Date | string;
  replies: Comment[];
}

export interface Post {
  id: string;
  author: User;
  isAnonymous: boolean;
  text: string;
  category: HumorCategory;
  reactions: Reaction[];
  comments: Comment[];
  timestamp: Date | string; // This is from the frontend PostCreator
  createdAt?: Date | string; // This comes from MongoDB
  updatedAt?: Date | string; // This comes from MongoDB
}

export interface User {
  id: string;
  handle: string;
  bio?: string;
  profilePicUrl?: string;
  humorTag: HumorTag;
  token?: string; // For storing JWT on the client
}

export type LeaderboardCategory = 'Top Humorists' | 'Funniest Humor Drops' | 'Best One-Liner';
export type LeaderboardTimeframe = 'Daily' | 'Weekly' | 'All-Time';

export interface Notification {
  id: string;
  recipient: User;
  sender: User;
  type: 'reaction' | 'comment' | 'reply';
  post: {
    id: string;
    text: string;
  };
  comment?: {
    id: string;
    text: string;
  };
  reactionType?: 'Amused' | 'Clever' | '...Wow';
  isRead: boolean;
  message: string;
  createdAt: string;
}
