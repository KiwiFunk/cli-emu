// Handle functions related to remote repo management

import git from 'isomorphic-git';
import fs from './fileSystem';
import { useRepoStore } from '../store/useRepoStore';
import { useAppStore } from '../store/useAppStore';

export async function createRepo(name: string, addReadme: boolean = false): Promise<void> {
  const dir = `/remote/${name}.git`;

  try {
    // Create the directory and initialise as a bare repo
    await fs.promises.mkdir('/remote').catch(() => {}); // Ensure /remote exists
    await fs.promises.mkdir(dir);
    await git.init({ fs, dir, bare: true });            // Init as bare repo

    // If README requested, write it directly into the bare repo
    if (addReadme) {
      console.log("This will be implemented later!");
    }

    // Override HEAD to default to 'main' instead of 'master'
    await fs.promises.writeFile(`${dir}/HEAD`, 'ref: refs/heads/main\n');

    // Update the store
    useRepoStore.getState().setRepoDir(dir);
    useAppStore.getState().bumpRevision();

  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'EEXIST') {
      throw new Error(`Repository '${name}' already exists`);
    }
    throw err;
  }
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
 * Get the commit log for a repo (bare repo — use gitdir directly)
 */
export async function getCommits(repoDir: string) {
  try {
    return await git.log({ fs, gitdir: repoDir });
  } catch {
    return [];
  }
}


/**
 * Get the file tree for a given ref and optional subfolder path.
 * Uses `gitdir` instead of `dir` because remote repos are bare —
 * their git objects live directly in the repo folder, not in a .git subfolder.
 *
 * @returns Array of objects with name, isDir, and path.
 */
export async function getFileTree(repoDir: string, ref: string, folderPath: string = "") {
  try {
    // For bare repos, the repoDir IS the gitdir (no .git subfolder)
    const commitSha = await git.resolveRef({ fs, gitdir: repoDir, ref: `refs/heads/${ref}` });

    const { tree } = folderPath
      ? await git.readTree({ fs, gitdir: repoDir, oid: commitSha, filepath: folderPath })
      : await git.readTree({ fs, gitdir: repoDir, oid: commitSha });

    const entries = tree.map(entry => ({
      name: entry.path,
      isDir: entry.type === 'tree',
      path: folderPath ? `${folderPath}/${entry.path}` : entry.path,
    }));

    return entries.sort((a, b) => {
      if (a.isDir === b.isDir) return a.name.localeCompare(b.name);
      return a.isDir ? -1 : 1;
    });

  } catch (error) {
    console.error("Error reading file tree:", error);
    return [];
  }
}
