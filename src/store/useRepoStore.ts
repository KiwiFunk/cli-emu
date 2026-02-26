// This store handles states related to the repository emulation.
// Although both the 'remote' and 'local' directories share the same FS, we treat them as seperate entiries.
// As such, we use a unique Zustand store for both.

import { create } from 'zustand';

interface RepoStore {
  cwd: string;
  setCwd: (newCwd: string) => void;
}

// Zustand store is just a hook!
export const useRepoStore = create<RepoStore>((set) => ({
  cwd: '/',
  setCwd: (newCwd) => set({ cwd: newCwd }),
}));

export function getCwd(): string {
  return useRepoStore.getState().cwd;
}
