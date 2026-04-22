// This store handles global application states
// It is shared between all other scoped stores and acts as a bridge for communication between them.

import { create } from 'zustand';

interface AppStore {
  gitRevision: number;
  bumpRevision: () => void;
  remote: string;
  setRemote: (remote: string) => void;
  browserUrl: string;
  setBrowserUrl: (url: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  gitRevision: 0,
  bumpRevision: () => set({ gitRevision: get().gitRevision + 1 }),
  remote: 'remote',
  setRemote: (remote) => set({ remote: remote }),
  browserUrl: 'https://123.abc',
  setBrowserUrl: (url) => set({ browserUrl: url }),
}));
