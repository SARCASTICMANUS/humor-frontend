// Authentication service to handle user login state
export const isUserLoggedIn = (): boolean => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return false;
  
  try {
    const parsed = JSON.parse(userInfo);
    return !!(parsed && parsed.token);
  } catch {
    return false;
  }
};

export const getUserToken = (): string | null => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return null;
  
  try {
    const parsed = JSON.parse(userInfo);
    return parsed.token || null;
  } catch {
    return null;
  }
};

export const clearUserData = (): void => {
  localStorage.removeItem('userInfo');
};