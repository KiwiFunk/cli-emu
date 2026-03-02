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

/**
 * Get all currently existing repos in /remote/. This is used to populate the repo index page.
 * @returns A string array of all repos in /remote/. Returns an empty array if none exist or on error.
 */
export async function fetchRemoteRepos(): Promise<string[]> {
  try {
    const contents = await fs.promises.readdir('/remote');

    return contents
      .filter((f: string) => f.endsWith('.git'))
      .map((repo) => `/remote/${repo}`);
  } catch {
    return [];
  }
}

/**
 * Get the commit log for a repo
 */
export async function getCommits(repoDir: string) {
  try {
    return await git.log({ fs, dir: repoDir });
  } catch {
    return [];
  }
}

/**
 * Get the top-level file tree from the latest commit
 * @returns Array of objects with name and whether they are a directory.
 */
export async function getFileTree(repoDir: string, ref: string) {
  try {
    // Get a flat list of all files in the commit
    const files = await git.listFiles({ fs, dir: repoDir, ref });

    // De-duplicate top-level entries and determine if dir or file
    return files.reduce((acc: { name: string, isDir: boolean }[], path) => {
      const parts = path.split('/');            // Split path into parts
      const name = parts[0];                    // Get the top-level entry (first part of the path)
      const isDir = parts.length > 1;           // If there are multiple parts, it's a directory
      if (!acc.find(e => e.name === name)) {    // Only add to accumulator if !exists.
        acc.push({ name, isDir });
      }
      return acc;                               // Return accumulator for the next iteration
    }, []);
  } catch {
    return [];
  }
}
