import React from 'react';

export type IconName = 
  'sun' | 'moon' | 'menu' |
  'reply' | 'plus' | 'user' | 'leaderboard' | 'home' | 'x' | 'more-horizontal' |
  'report' | 'swords' | 'raccoon' | 'send' | 'log-out' |
  'fire' | 'heart-crack' | 'laptop' | 'file-text' | 'landmark' | 'poop' |
  // New reaction icons
  'laugh' | 'lightbulb' | 'meh' | 'award' | 'tag' |
  // Action icons
  'trash' | 'edit' |
  // Notification icons
  'bell' | 'message-circle' | 'heart';

interface IconProps {
  name: IconName;
  className?: string;
}

const SVGs: Record<IconName, React.ReactNode> = {
  sun: <path d="M12 1v2m-6.36 1.64l1.41 1.41M1 12h2m1.64 6.36l1.41-1.41M12 21v2m6.36-1.64l-1.41-1.41M23 12h-2m-1.64-6.36l-1.41 1.41M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />,
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  reply: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  plus: <path d="M12 5v14m-7-7h14" />,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></>,
  leaderboard: <><path d="M16 16v-4M12 16v-8M8 16v-2" /><path d="M4 22h16" /><path d="M3 2h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" /></>,
  home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  'more-horizontal': <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
  report: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
  swords: <><path d="m14.5 2-3.5 3.5 4 4L18.5 6l-4-4z"/><path d="M12 12 2 22"/><path d="m10 10 10 10"/><path d="m6.5 2.5-4 4L6 10l4-4-3.5-3.5z"/></>,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  fire: <><path d="M8.5 14.5c0 4.28 2.5 4.5 3.5 0s2.5-4.5 3.5 0c1 4.5 3.5 4.28 3.5 0 0-4.28-2-6.5-7-12-5 5.5-7 7.72-7 12z" /></>,
  'heart-crack': <><path d="M19.4 6.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-7.4 1.5L2 16h20l-2.6-9.5z"/><path d="m12 13-1-1 2-2-3-3-2 2-1.5-1.5L9 5l4 4-2 2 1 1z"/></>,
  laptop: <><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.56A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-1-1.44L4 16z"/></>,
  'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 10 8 10 8 8"/></>,
  landmark: <><path d="M3 22h18M5 19v-9l7-4 7 4v9M5 19h14"/></>,
  poop: <><path d="M20 11.5c0-1.7-1.3-3-3-3h-1c-1.7 0-3-1.3-3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3H6c-1.7 0-3 1.3-3 3s1.3 3 3 3h12c1.7 0 3-1.3 3-3z"/><path d="M8.5 18c0 1.7 1.3 3 3 3s3-1.3 3-3H8.5z"/><path d="M5.5 14.5c0 1.7 1.3 3 3 3s3-1.3 3-3h-6z"/></>,
  raccoon: (
    <>
      <path d="M20.3,14.6 C20.3,18 16.7,21 12,21 C7.3,21 3.7,18 3.7,14.6 C3.7,12.3 4.9,9.8 6.3,7.9 C7.6,6.2 9.6,5 12,5 C14.4,5 16.4,6.2 17.7,7.9 C19.1,9.8 20.3,12.3 20.3,14.6 Z" />
      <path d="M6.5,9.5 C5,9.5 3.8,8.3 3.8,6.8 C3.8,5.2 5,4 6.5,4 C8,4 9.2,5.2 9.2,6.8 C9.2,8.3 8,9.5 6.5,9.5 Z" />
      <path d="M17.5,9.5 C16,9.5 14.8,8.3 14.8,6.8 C14.8,5.2 16,4 17.5,4 C19,4 20.2,5.2 20.2,6.8 C20.2,8.3 19,9.5 17.5,9.5 Z" />
      <circle cx="12" cy="17.5" r="1.5" fill="currentColor" />
      {/* Pixelated Glasses */}
      <g className="text-accent-500" fill="currentColor" stroke="none">
        <rect x="4" y="11" width="8" height="3" />
        <rect x="12" y="11" width="8" height="3" />
      </g>
    </>
  ),
  laugh: <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>,
  lightbulb: <><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19a7 7 0 0 0-7 7c0 1.93 1.12 3.58 2.76 4.41A2 2 0 0 1 8 14v2h8v-2c0-.62.26-1.19.68-1.59C17.88 11.58 19 9.93 19 8a7 7 0 0 0-7-7z"/></>,
  meh: <><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>,
  award: <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 22 12 20 17 22 15.79 13.88"/></>,
  tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  'message-circle': <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
  heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {SVGs[name]}
    </svg>
  );
};

export default Icon;