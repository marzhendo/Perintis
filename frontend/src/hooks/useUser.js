import { useState } from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const STORAGE_KEY = 'perintis_user';

function loadUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function useUser() {
  const [user, setUser] = useState(loadUser);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('perintis_token');
    try {
      signOut(auth);
    } catch (e) {
      console.error("Gagal melakukan signout dari Firebase:", e);
    }
  };

  return { user, login, logout };
}
