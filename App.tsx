
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Feed from './components/Feed';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import { Post, User, Comment, HumorTag } from './types';
import DuelPlaceholder from './components/DuelPlaceholder';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import * as api from './services/api';

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);

  type View = 'feed' | 'leaderboard' | 'profile' | 'duel';
  const [activeView, setActiveView] = useState<View>('feed');
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // --- Theme Management ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (userPrefersDark) {
      setTheme('dark');
    }
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);
  
  // --- Data Fetching ---
  const fetchData = async () => {
    try {
        setLoading(true);
        const [fetchedPosts, fetchedUsers] = await Promise.all([
            api.apiFetchPosts(),
            api.apiFetchUsers(),
        ]);
        setPosts(fetchedPosts);
        setUsers(fetchedUsers);
    } catch (error) {
        console.error("Failed to fetch data", error);
        // Handle error display to user if necessary
    } finally {
        setLoading(false);
    }
  };

  // --- Auth Management ---
   useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    }
    // Set loading to false only after checking for user info
    // to prevent showing login page for a split second on refresh.
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (handle: string, pass: string) => {
    try {
        const userData = await api.apiLogin(handle, pass);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setActiveView('feed');
    } catch (error) {
        alert(error.message);
    }
  };

  const handleSignup = async (handle: string, pass: string, humorTag: HumorTag) => {
    try {
        const userData = await api.apiSignup(handle, pass, humorTag);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setActiveView('feed');
    } catch(error) {
        alert(error.message);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthView('login');
    setPosts([]);
    setUsers([]);
  };

  // --- Content Management ---
  const handleNewPost = async (postData: { text: string, category: string, isAnonymous: boolean }) => {
    try {
        const newPost = await api.apiCreatePost(postData);
        setPosts([newPost, ...posts]);
    } catch (error) {
        console.error("Failed to create post", error);
        alert("Could not create post. Please try again.");
    }
  };
  
  const handleNewReply = async (postId: string, parentCommentId: string | null, text: string) => {
    if (!currentUser) return;
    try {
        const updatedPost = await api.apiAddComment(postId, text, parentCommentId);
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
        console.error("Failed to add reply", error);
        alert("Could not add reply. Please try again.");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
        await api.apiDeletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
        console.error("Failed to delete post", error);
        alert("Could not delete post. Please try again.");
    }
  };

  const handleUpdatePost = async (postId: string, updatedPost: Post) => {
    try {
        setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    } catch (error) {
        console.error("Failed to update post", error);
        alert("Could not update post. Please try again.");
    }
  };

  // --- Navigation ---
  const handleNavigate = (view: 'feed' | 'leaderboard' | 'duel') => {
    setActiveView(view);
    setSelectedProfile(null);
  }

  const handleProfileClick = (user: User) => {
    setSelectedProfile(user);
    setActiveView('profile');
  };
  
  const handleProfileClose = () => {
    setSelectedProfile(null);
    setActiveView('feed');
  };
  
  if (loading && !isAuthenticated) {
    return <div className="min-h-screen bg-[#F8F7F4] dark:bg-gray-900" />; // Blank screen while checking auth
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] dark:bg-gray-900 p-4">
        {authView === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  const renderActiveView = () => {
    if (!currentUser) return null;

    if(loading) {
        return <div className="text-center p-10 font-bold text-lg">Loading Content...</div>
    }

    switch (activeView) {
      case 'profile':
        if (selectedProfile) {
          return <Profile user={selectedProfile} posts={posts} onClose={handleProfileClose} onProfileClick={handleProfileClick} currentUser={currentUser} onNewReply={handleNewReply} onDeletePost={handleDeletePost} onUpdatePost={handleUpdatePost} />;
        }
        return <Feed posts={posts} currentUser={currentUser} onNewPost={handleNewPost} onProfileClick={handleProfileClick} onNewReply={handleNewReply} onDeletePost={handleDeletePost} onUpdatePost={handleUpdatePost} />;
      case 'leaderboard':
        return <Leaderboard users={users} posts={posts} onProfileClick={handleProfileClick} />;
      case 'duel':
        return <DuelPlaceholder />;
      case 'feed':
      default:
        return <Feed posts={posts} currentUser={currentUser} onNewPost={handleNewPost} onProfileClick={handleProfileClick} onNewReply={handleNewReply} onDeletePost={handleDeletePost} onUpdatePost={handleUpdatePost} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans`}>
      <Header
        currentUser={currentUser!}
        onNavigate={handleNavigate}
        onProfileClick={handleProfileClick}
        activeView={activeView}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default App;
