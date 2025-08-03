
import { Post, User, ReactionType, HumorTag, Notification } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthToken = (): string | null => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo).token : null;
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    // This handles HTTP errors (like 401, 404, 500)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from server.' }));
      throw new Error(errorData.message || 'Something went wrong with the request.');
    }
    
    // Handle cases where response body might be empty (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      return {} as T;
    }
  } catch (error) {
    // This catches network errors (like "Failed to fetch")
    console.error(`API request to ${endpoint} failed:`, error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Could not connect to the server at ${API_URL}. Please ensure the backend server is running on port 3001.`);
    }
    
    // Re-throw other errors as-is
    throw error;
  }
};


// --- Auth ---
export const apiLogin = (handle: string, pass: string): Promise<User & { token: string }> => {
    return request(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ handle, password: pass }),
    });
};

export const apiSignup = (handle: string, pass: string, humorTag: HumorTag): Promise<User & { token: string }> => {
    return request(`/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ handle, password: pass, humorTag }),
    });
};

// --- Posts ---
export const apiFetchPosts = (): Promise<Post[]> => request('/posts');

export const apiFetchPost = (postId: string): Promise<Post> => request(`/posts/${postId}`);

export const apiCreatePost = (postData: { text: string, category: string, isAnonymous: boolean }): Promise<Post> => {
    return request('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
    });
};

export const apiReactToPost = (postId: string, reactionType: ReactionType): Promise<Post> => {
    return request(`/posts/${postId}/react`, {
        method: 'POST',
        body: JSON.stringify({ reactionType }),
    });
};

export const apiAddComment = (postId: string, text: string, parentCommentId: string | null): Promise<Post> => {
    return request(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text, parentCommentId }),
    });
};

export const apiUpdatePost = (postId: string, postData: { text: string, category: string, isAnonymous: boolean }): Promise<Post> => {
    return request(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
    });
};

export const apiDeletePost = (postId: string): Promise<void> => {
    return request(`/posts/${postId}`, {
        method: 'DELETE',
    });
};

// --- Users ---
export const apiFetchUsers = (): Promise<User[]> => request('/users');

// --- Notifications ---
export const apiFetchNotifications = (): Promise<Notification[]> => request('/notifications');

export const apiMarkNotificationAsRead = (notificationId: string): Promise<Notification> => {
  return request(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
};

export const apiMarkAllNotificationsAsRead = (): Promise<{ message: string }> => {
  return request('/notifications/read-all', {
    method: 'PATCH',
  });
};

export const apiGetUnreadNotificationCount = (): Promise<{ count: number }> => request('/notifications/unread-count');