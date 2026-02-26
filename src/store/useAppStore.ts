// This store handles global application states
// It is shared between all other scoped stores and acts as a bridge for communication between them.

import { create } from 'zustand';

interface AppStore {
  gitRevision: number;
}

export const useAppStore = create<AppStore>(() => ({
  gitRevision: 0,
}));

export function bumpRevision(): void {
  const current = useAppStore.getState().gitRevision;
  const next = current + 1;
  useAppStore.setState({ gitRevision: next });
}
