// Handle functions related to remote repo management

import git from 'isomorphic-git';
import fs from './fileSystem';
import { useRepoStore } from '../store/useRepoStore';
import { useAppStore } from '../store/useAppStore';

export async function createRepo(name: string, addReadme: boolean = false): Promise<void> {
  const dir = `/remote/${name}.git`;

  // Create the directory and initialise as a bare repo
  await fs.promises.mkdir('/remote').catch(() => {}); // Ensure /remote exists
  await fs.promises.mkdir(dir);
  await git.init({ fs, dir, bare: true });            // Init as bare repo

  // If README requested, write it directly into the bare repo
  // Add later

  // Update the store
  useRepoStore.getState().setRepoDir(dir);
  useAppStore.getState().bumpRevision();
}

export async function hasRemoteRepo(): Promise<boolean> {
  try {
    const contents = await fs.promises.readdir('/remote');
    return contents.filter((f: string) => f.endsWith('.git')).length > 0;
  } catch {
    return false;
  }
}
