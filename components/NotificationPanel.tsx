import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { Notification } from '../types';
import { apiFetchNotifications, apiMarkNotificationAsRead, apiMarkAllNotificationsAsRead } from '../services/api';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const fetchedNotifications = await apiFetchNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiMarkNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiMarkAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reaction':
        return 'heart';
      case 'comment':
        return 'message-circle';
      case 'reply':
        return 'reply';
      default:
        return 'bell';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-16 right-4 w-96 max-h-[80vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-900 dark:border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            >
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Icon name="bell" className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">You'll see notifications here when people react to or comment on your posts</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={notification.sender.profilePicUrl || `https://picsum.photos/seed/${notification.sender.id}/100/100`}
                        alt={notification.sender.handle}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon name={getNotificationIcon(notification.type) as any} className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                          {notification.sender.handle}
                        </span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel; 