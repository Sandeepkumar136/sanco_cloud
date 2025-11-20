// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { account, ID } from "../appwrite";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchCurrentUser() {
    try {
      const res = await account.get();
      setUser(res);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function register({ firstName, lastName, email, password }) {
    const name = `${firstName} ${lastName}`.trim();
    await account.create(ID.unique(), email, password, name);
    await login({ email, password });
  }

  async function login({ email, password }) {
    await account.createEmailPasswordSession(email, password);
    await fetchCurrentUser();
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  const value = { user, login, logout, register, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
