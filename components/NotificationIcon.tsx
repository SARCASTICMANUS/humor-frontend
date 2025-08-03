import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { apiGetUnreadNotificationCount } from '../services/api';
import { isUserLoggedIn } from '../services/authService';

interface NotificationIconProps {
  onClick: () => void;
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ onClick, className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      // Only fetch if user is logged in
      if (!isUserLoggedIn()) {
        setUnreadCount(0);
        setIsError(false);
        return;
      }

      try {
        const { count } = await apiGetUnreadNotificationCount();
        setUnreadCount(count);
        setIsError(false);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        setIsError(true);
        // Don't reset count on error, keep showing last known value
      }
    };

    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds, but only if not in error state and user is logged in
    const interval = setInterval(() => {
      if (!isError && isUserLoggedIn()) {
        fetchUnreadCount();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isError]);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors ${className} ${isError ? 'opacity-50' : ''}`}
        aria-label="Notifications"
        title={isError ? 'Unable to connect to server' : 'Notifications'}
      >
        <Icon name="bell" className="w-5 h-5" />
      </button>
      {unreadCount > 0 && !isError && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      {isError && (
        <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
          !
        </span>
      )}
    </div>
  );
};

export default NotificationIcon; 