import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../lib/api';

export interface EnrolledCourseItem {
  courseSlug: string;
  courseTitle: string;
  enrolledAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  classLevel: string;
  targetClass?: string;
  admissionId?: string;
  enrolledCourses: (string | EnrolledCourseItem)[];
  createdAt?: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (phone: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, phone: string, targetClass: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'eph_user_session_v2';
const REGISTERED_USERS_KEY = 'eph_registered_users_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to load user session from localStorage', err);
    }
    return null;
  });

  // Helper to save registered user locally
  const saveRegisteredUserLocally = (newUser: UserSession) => {
    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      let list: Record<string, UserSession> = existingRaw ? JSON.parse(existingRaw) : {};
      list[newUser.phone.trim()] = newUser;
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save registered user locally', e);
    }
  };

  // Helper to check registered user locally
  const getRegisteredUserLocally = (phone: string): UserSession | null => {
    try {
      const existingRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      if (existingRaw) {
        const list: Record<string, UserSession> = JSON.parse(existingRaw);
        return list[phone.trim()] || null;
      }
    } catch (e) {
      console.warn('Failed to get registered user locally', e);
    }
    return null;
  };

  const login = async (phone: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      return { success: false, error: 'Kripya apna mobile number darj karein.' };
    }

    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      const data = await res.json();

      if (data.success && data.user) {
        const sessionUser: UserSession = {
          id: data.user.id,
          name: data.user.name || name?.trim() || 'Student',
          phone: data.user.phone,
          classLevel: data.user.classLevel || '10',
          targetClass: `Class ${data.user.classLevel || '10'}`,
          admissionId: 'EPH-2026-' + (data.user.id.slice(-4) || '8842'),
          enrolledCourses: data.user.enrolledCourses || [`Class ${data.user.classLevel || '10'} Target Batch`],
          createdAt: new Date(data.user.createdAt || Date.now()).toISOString().split('T')[0]
        };

        setUser(sessionUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionUser));
        saveRegisteredUserLocally(sessionUser);
        return { success: true };
      } else {
        // Check local registered users list as fallback
        const localReg = getRegisteredUserLocally(cleanPhone);
        if (localReg) {
          setUser(localReg);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localReg));
          return { success: true };
        }
        return {
          success: false,
          error: data.error || 'Yeh mobile number registered nahi hai. Pehle Sign Up (Register) karein.'
        };
      }
    } catch (err) {
      console.warn('Network error logging in, checking local registered list:', err);
      const localReg = getRegisteredUserLocally(cleanPhone);
      if (localReg) {
        setUser(localReg);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localReg));
        return { success: true };
      }
      return {
        success: false,
        error: 'Yeh mobile number registered nahi hai. Pehle Sign Up (Register) karein.'
      };
    }
  };

  const signup = async (
    name: string,
    phone: string,
    targetClass: string,
    email?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim() || !phone.trim()) {
      return { success: false, error: 'Name aur Mobile Number required hain.' };
    }

    const cleanPhone = phone.trim();
    const cleanClass = targetClass.replace(/Class\s*/i, '') || '10';

    try {
      const res = await fetch(getApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          classLevel: cleanClass
        })
      });
      const data = await res.json();

      if (data.success && data.user) {
        const sessionUser: UserSession = {
          id: data.user.id,
          name: data.user.name,
          phone: data.user.phone,
          classLevel: data.user.classLevel,
          targetClass: `Class ${data.user.classLevel}`,
          admissionId: 'EPH-2026-' + (data.user.id.slice(-4) || '7721'),
          enrolledCourses: data.user.enrolledCourses || [`Class ${data.user.classLevel} Target Batch`],
          createdAt: new Date(data.user.createdAt || Date.now()).toISOString().split('T')[0]
        };

        setUser(sessionUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionUser));
        saveRegisteredUserLocally(sessionUser);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed.' };
      }
    } catch (err) {
      console.warn('Network error signing up, creating fallback session:', err);
      const fallbackUser: UserSession = {
        id: 'usr_' + cleanPhone,
        name: name.trim(),
        phone: cleanPhone,
        classLevel: cleanClass,
        targetClass: targetClass || 'Class 10',
        admissionId: 'EPH-2026-3391',
        enrolledCourses: [`${targetClass} Target Batch`],
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUser(fallbackUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
      saveRegisteredUserLocally(fallbackUser);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
