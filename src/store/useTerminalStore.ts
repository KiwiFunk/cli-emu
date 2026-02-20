import { create } from 'zustand';

interface TerminalStore {
  cwd: string;
  setCwd: (newCwd: string) => void;
}

// Zustand store is just a hook!
export const useTerminalStore = create<TerminalStore>((set) => ({
  cwd: '/',
  setCwd: (newCwd) => set({ cwd: newCwd }),
}));
