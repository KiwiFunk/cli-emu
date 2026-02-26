// This store handles states related to the repository emulation.
// Although both the 'remote' and 'local' directories share the same FS, we treat them as seperate entiries.
// As such, we use a unique Zustand store for both.

import { create } from 'zustand';

interface RepoStore {
  repoDir: string | null;
  setRepoDir: (newDir: string) => void;
}

export const useRepoStore = create<RepoStore>((set) => ({
  repoDir: '/remote/',
  setRepoDir: (newDir) => set({ repoDir: newDir }),
}));
