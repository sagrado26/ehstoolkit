import { useState, useCallback } from "react";

export interface SimulatedUser {
  id: string;
  name: string;
  role: "Lead" | "Manager" | "Engineer";
  email?: string;
}

const STORAGE_KEY = "planflow_simulated_users";

export const DEFAULT_USERS: SimulatedUser[] = [
  { id: "u1", name: "Carl K.", role: "Manager", email: "carl.k@company.com" },
  { id: "u2", name: "Sarah Murphy", role: "Lead", email: "s.murphy@company.com" },
  { id: "u3", name: "James O'Brien", role: "Engineer", email: "j.obrien@company.com" },
  { id: "u4", name: "Aoife Walsh", role: "Lead", email: "a.walsh@company.com" },
  { id: "u5", name: "Tom Brennan", role: "Manager", email: "t.brennan@company.com" },
  { id: "u6", name: "David Chen", role: "Engineer", email: "d.chen@company.com" },
  { id: "u7", name: "Niamh Reilly", role: "Engineer", email: "n.reilly@company.com" },
];

function loadUsers(): SimulatedUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_USERS;
}

function persist(users: SimulatedUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

export function useSimulatedUsers() {
  const [users, setUsers] = useState<SimulatedUser[]>(loadUsers);

  const addUser = useCallback((user: Omit<SimulatedUser, "id">) => {
    setUsers(prev => {
      const next = [...prev, { ...user, id: `u${Date.now()}` }];
      persist(next);
      return next;
    });
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers(prev => {
      const next = prev.filter(u => u.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const updateUser = useCallback((id: string, changes: Partial<Omit<SimulatedUser, "id">>) => {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...changes } : u);
      persist(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    persist(DEFAULT_USERS);
    setUsers(DEFAULT_USERS);
  }, []);

  return { users, addUser, removeUser, updateUser, resetToDefaults };
}
