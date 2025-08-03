
import { User, Post, HumorTag, ReactionType, HumorCategory } from './types';
import { IconName } from './components/Icon';

// Mock data is no longer the source of truth but can be kept for testing or reference.
export const USERS: User[] = [
  { id: 'u1', handle: 'SarcasmSorcerer', bio: 'Fluent in sarcasm and eye-rolling.', profilePicUrl: 'https://picsum.photos/seed/u1/100/100', humorTag: HumorTag.Sarcastic },
  { id: 'u2', handle: 'WholesomeWeapon', bio: 'Just here to spread joy and dad jokes.', profilePicUrl: 'https://picsum.photos/seed/u2/100/100', humorTag: HumorTag.Wholesome },
];

export const MOCK_POSTS: Post[] = [];


export const CATEGORIES: { name: HumorCategory; icon: IconName }[] = [
    { name: HumorCategory.Roasts, icon: 'fire' },
    { name: HumorCategory.Dating, icon: 'heart-crack' },
    { name: HumorCategory.Tech, icon: 'laptop' },
    { name: HumorCategory.Life, icon: 'file-text' },
    { name: HumorCategory.Political, icon: 'landmark' },
    { name: HumorCategory.Random, icon: 'poop' },
];

export const USER_LEVELS = [
    { score: 0, title: 'Amateur Humorist' },
    { score: 100, title: 'Local Wit' },
    { score: 500, title: 'Sarcasm Professional' },
    { score: 1500, title: 'Comedy Virtuoso' },
    { score: 3000, title: 'Certified Funny Person' },
    { score: 10000, title: 'Humor Deity' }
];

export const REACTION_POINTS: Record<ReactionType, number> = {
    'Amused': 5,
    'Clever': 4,
    '...Wow': 2,
};

// Updated to handle new reaction data structure from backend
export const calculateHumorScore = (post: Post): number => {
    if (!post.reactions) return 0;
    return post.reactions.reduce((total, reaction) => {
        const count = reaction.users?.length || 0;
        return total + (count * (REACTION_POINTS[reaction.type] || 0));
    }, 0);
};

export const getUserHumorScore = (userId: string, posts: Post[]): number => {
    return posts
        .filter(p => p.author?.id === userId && !p.isAnonymous)
        .reduce((total, post) => total + calculateHumorScore(post), 0);
};

export const getUserLevel = (score: number): string => {
    let currentLevel = USER_LEVELS[0].title;
    for (const level of USER_LEVELS) {
        if (score >= level.score) {
            currentLevel = level.title;
        } else {
            break;
        }
    }
    return currentLevel;
};

export const BANNED_WORDS = ['hate', 'slur1', 'slur2']; // Example words
