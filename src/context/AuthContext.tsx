import React, { createContext, useContext, useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';

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

// This key stores ONLY the current logged-in session (a cache of what the
// backend already confirmed), so a refresh doesn't force a re-login.
// It is never used to fabricate a user or bypass the backend.
const SESSION_STORAGE_KEY = 'eph_user_session_v3';

function mapServerUser(data: any, fallbackName?: string): UserSession {
  const classLevel = data.classLevel || '10';
  return {
    id: data.id,
    name: data.name || fallbackName?.trim() || 'Student',
    phone: data.phone,
    classLevel,
    targetClass: data.targetClass || `Class ${classLevel}`,
    admissionId: data.admissionId || `EPH-2026-${(data.id || '').toString().slice(-4) || '0000'}`,
    enrolledCourses: data.enrolledCourses || [],
    createdAt: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const persistSession = (sessionUser: UserSession | null) => {
    setUser(sessionUser);
    if (sessionUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const login = async (phone: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      return { success: false, error: 'Kripya apna mobile number darj karein.' };
    }

    try {
      const data = await apiFetch<{ success: boolean; user: any }>('/api/auth/login', {
        method: 'POST',
        json: { phone: cleanPhone },
      });
      const sessionUser = mapServerUser(data.user, name);
      persistSession(sessionUser);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 404
            ? 'Yeh mobile number registered nahi hai. Pehle Sign Up (Register) karein.'
            : err.message
          : 'Kuch gadbad ho gayi. Kripya thodi der baad try karein.';
      return { success: false, error: message };
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
      const data = await apiFetch<{ success: boolean; user: any }>('/api/auth/signup', {
        method: 'POST',
        json: { name: name.trim(), phone: cleanPhone, classLevel: cleanClass, email },
      });
      const sessionUser = mapServerUser(data.user, name);
      persistSession(sessionUser);
      return { success: true };
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 409
            ? 'Yeh mobile number pehle se registered hai. Login karein.'
            : err.message
          : 'Signup fail ho gaya. Kripya thodi der baad try karein.';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    persistSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
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