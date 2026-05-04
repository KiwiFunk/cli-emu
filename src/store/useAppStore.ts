// This store handles global application states
// It is shared between all other scoped stores and acts as a bridge for communication between them.

import { create } from 'zustand';
import fs from '@/lib/fileSystem';

interface AppConfig {
  remote: string;
  username: string;
}

interface AppStore {
  gitRevision: number;
  bumpRevision: () => void;

  // State
  remote: string;
  username: string;
  browserUrl: string;

  // Actions
  setRemote: (remote: string) => void;
  setUsername: (username: string) => void;
  setBrowserUrl: (url: string) => void;

  // FS Sync
  loadConfig: () => Promise<void>;
  saveConfig: (config: AppConfig) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  gitRevision: 0,
  bumpRevision: () => set({ gitRevision: get().gitRevision + 1 }),

  remote: '',   // Default to empty, force user to chose on initial startup
  username: 'User',
  browserUrl: 'https://123.abc',

  setRemote: (remote) => {
    set({ remote });                                        // Update Zustand state
    get().saveConfig({ remote, username: get().username }); // Persist to FS
  },
  setUsername: (username) => {
    set({ username });
    get().saveConfig({ remote: get().remote, username });
  },
  setBrowserUrl: (url) => set({ browserUrl: url }),

  loadConfig: async () => {
    try {
      const data = await fs.promises.readFile('/config.json', 'utf8') as string;
      const config = JSON.parse(data) as AppConfig;

      // If config values exist, set them in store.
      if (config.remote) set({ remote: config.remote });
      if (config.username) set({ username: config.username });
    } catch (e) {
      // File doesn't exist yet - ignore.
    }
  },

  saveConfig: async (config) => {
    try {
      await fs.promises.writeFile('/config.json', JSON.stringify(config, null, 2), 'utf8');
    } catch (e) {
      console.error("Failed to save config to FS:", e);
    }
  }
}));
