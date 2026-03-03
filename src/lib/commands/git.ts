import git from 'isomorphic-git';
import fs from '../fileSystem';
import { getCwd } from "../../store/useTerminalStore.ts";
import type { CommandContext } from "../../types.ts";
import type { CommitObject, TreeEntry } from 'isomorphic-git';
import { resolvePath, exists, urlToPath } from './helpers.ts';
import { mkdir } from './shell.ts';
import { useAppStore } from '../../store/useAppStore.ts';

/**
 * Internal Git Router
 * Routes git commands using the subcmd property of the context.
 */
export async function main(ctx: CommandContext): Promise<string> {
  const { subcmd } = ctx;

  const subcommands: Record<string, (ctx: CommandContext) => Promise<string>> = {
    "init": init,
    "remote": remote,
    "clone": clone,
    "add": add,
    "commit": commit,
    "push": push,
    "pull": pull,
    "status": async () => "Status: Not yet implemented",
  };

  const handler = subcommands[subcmd || ""];
  if (!handler) return subcmd ? `git: '${subcmd}' is not a git command.` : "usage: git <command>";

  return await handler(ctx);
}

/**
 * Initializes a new Git repository. If a directory is specified, it will initialize there.
 * If the directory doesn't exist, it will be created first.
 * If no directory is specified, it initializes in the current working directory.
 *
 * After init, we override HEAD to point at refs/heads/main instead of the
 * isomorphic-git default (master). This matches modern git behaviour and
 * ensures `git push origin main` works out of the box.
 */
export async function init(ctx: CommandContext): Promise<string> {
  const { args } = ctx;

  // Determine target directory
  const dir = args.length === 0 ? getCwd() : resolvePath(args[0]);

  // Create the directory if it doesn't exist
  if (args.length > 0 && !(await exists(fs, dir, 'dir'))) {
    await mkdir({ args: [args[0]], flags: { p: true } });
  }

  // Init the repo
  await git.init({ fs, dir });

  // Override HEAD to default to 'main' instead of 'master'
  await fs.promises.writeFile(`${dir}/.git/HEAD`, 'ref: refs/heads/main\n');

  return `Initialized empty Git repository in ${dir}/.git/`;
}

/**
 * Manage remote connections for the repository. This includes listing existing remotes, adding new ones, removing, and renaming them.
 *
 * Supported commands:
 *  git remote                              list remote names
 *  git remote -v                           list remotes with their URLs
 *  git remote add <name> <url>             register a new remote e.g. `git remote add origin https://github.com/user/repo.git`
 *  git remote remove <name>                remove a remote
 *  git remote rename <old> <new>           rename a remote
 *
 *  Remote add dpes NOT check if it is valid - neither does real git. Check happens on Push
 */
export async function remote(ctx: CommandContext): Promise<string> {
  const { args, flags } = ctx;
  const dir = getCwd();

  // git remote
  if (args.length === 0) {
    try {
      const remotes = await git.listRemotes({ fs, dir });

      if (remotes.length === 0) return '';

      if (flags['v']) {
        // Show name + URL for both fetch and push, just like real git
        return remotes
          .flatMap(({ remote, url }) => [
            `${remote}\t${url} (fetch)`,
            `${remote}\t${url} (push)`,
          ])
          .join('\r\n');
      }

      // No -v: just the names, one per line
      return remotes.map(r => r.remote).join('\r\n');

    } catch {
      return `fatal: not a git repository (or any of the parent directories): .git`;
    }
  }

  const subAction = args[0];  // e.g. 'add', 'remove', 'rename'

  // git remote add <name> <url>
  if (subAction === 'add') {
    const remoteName = args[1];
    const remoteUrl  = args[2];

    if (!remoteName || !remoteUrl) {
      return `usage: git remote add <name> <url>`;
    }

    // Validate it at least looks like a github.com URL
    if (urlToPath(remoteUrl) === null) {
      return `error: invalid remote URL '${remoteUrl}'\n` +
             `Hint: URLs should look like https://github.com/user/repo.git`;
    }

    try {
      // Store the URL exactly as usr typed it — matches real git.
      // urlToPath() is called at push time.
      await git.addRemote({ fs, dir, remote: remoteName, url: remoteUrl });
      return '';
    } catch (err: unknown) {
      const msg = (err as Error).message ?? '';
      if (msg.includes('already exists')) {
        return `error: remote ${remoteName} already exists.`;
      }
      return `error: ${msg}`;
    }
  }

  // git remote remove <name>
  if (subAction === 'remove' || subAction === 'rm') {
    const remoteName = args[1];
    if (!remoteName) return `usage: git remote remove <name>`;

    try {
      await git.deleteRemote({ fs, dir, remote: remoteName });
      return '';  // Silent on success
    } catch {
      return `error: No such remote: '${remoteName}'`;
    }
  }

  // git remote rename <old> <new>
  if (subAction === 'rename') {
    const oldName = args[1];
    const newName = args[2];
    if (!oldName || !newName) return `usage: git remote rename <old> <new>`;

    try {
      const remotes = await git.listRemotes({ fs, dir });
      const existing = remotes.find(r => r.remote === oldName);
      if (!existing) return `error: No such remote: '${oldName}'`;

      // isomorphic-git has no renameRemote — delete and re-add with the stored URL
      await git.deleteRemote({ fs, dir, remote: oldName });
      await git.addRemote({ fs, dir, remote: newName, url: existing.url });
      return '';  // Silent on success
    } catch (err: unknown) {
      return `error: ${(err as Error).message}`;
    }
  }

  // Unknown subaction
  return `error: Unknown subcommand: ${subAction}\n` +
         `usage: git remote [-v]\n` +
         `   or: git remote add <name> <url>\n` +
         `   or: git remote rename <old> <new>\n` +
         `   or: git remote remove <name>`;
}

/**
 * Copy all git objects reachable from a given SHA from one repo into another.
 * Walks commit -> tree -> blob recursively.
 *
 * srcDir  = the .git folder (or bare repo folder) to read FROM
 * destDir = the .git folder (or bare repo folder) to write INTO
 */
async function copyMissingObjects(srcDir: string, destDir: string, sha: string): Promise<void> {

  const visited = new Set<string>();

  async function copyObject(oid: string): Promise<void> {
    if (visited.has(oid)) return;   // Exit condition for recursion
    visited.add(oid);

    // Already exists in destination? Skip.
    try {
      await git.readObject({ fs, gitdir: destDir, oid, format: 'deflated' });
      return;
    } catch { /* not there yet — continue */ }

    // Read from source
    const obj = await git.readObject({ fs, gitdir: srcDir, oid, format: 'parsed' });

    if (obj.type === 'commit') {
      const c = obj.object as CommitObject;
      await git.writeCommit({ fs, gitdir: destDir, commit: c });
      await copyObject(c.tree);
      for (const parent of c.parent) await copyObject(parent);
    } else if (obj.type === 'tree') {
      const entries = obj.object as TreeEntry[];
      await git.writeTree({ fs, gitdir: destDir, tree: entries });
      for (const entry of entries) await copyObject(entry.oid);
    } else if (obj.type === 'blob') {
      await git.writeBlob({ fs, gitdir: destDir, blob: obj.object as Uint8Array });
    }
  }

  await copyObject(sha);
}

/**
 * git clone <url> [<directory>]
 *
 * Clones a remote repo by copying all objects, setting up refs, and checking out files.
 * No HTTP needed — all done via local filesystem.
 */
export async function clone(ctx: CommandContext): Promise<string> {
  const { args } = ctx;
  const userUrl = args[0];
  if (!userUrl) return 'fatal: You must specify a repository to clone.';

  // Extract repo name from URL for default directory name
  const repoName = userUrl.split('/').pop()?.replace(/\.git$/, '') ?? '';
  const targetDir = args[1] ? resolvePath(args[1]) : resolvePath(repoName);

  const bareDir = urlToPath(userUrl);
  if (!bareDir) return 'fatal: invalid repository URL';
  if (!(await exists(fs, bareDir, 'dir'))) return `fatal: repository '${userUrl}' not found`;

  try {
    // Create target dir and init
    await mkdir({ args: [targetDir], flags: { p: true } });
    await git.init({ fs, dir: targetDir });

    // Store the display URL as origin (same as real git)
    await git.addRemote({ fs, dir: targetDir, remote: 'origin', url: userUrl });

    // Resolve the remote's HEAD branch
    let remoteSha: string;
    try {
      remoteSha = await git.resolveRef({ fs, dir: bareDir, ref: 'refs/heads/main' });
    } catch {
      // Empty repo — nothing to clone
      return `Cloning into '${repoName}'...\nwarning: remote HEAD refers to nonexistent ref, unable to checkout.`;
    }

    // Copy all objects
    await copyMissingObjects(bareDir, `${targetDir}/.git`, remoteSha);

    // Set up local branch ref
    await git.writeRef({ fs, dir: targetDir, ref: 'refs/heads/main', value: remoteSha, force: true });
    await git.writeRef({ fs, dir: targetDir, ref: 'HEAD', value: 'refs/heads/main', force: true, symbolic: true });

    // Checkout working tree
    await git.checkout({ fs, dir: targetDir, ref: 'main', force: true });

    return `Cloning into '${repoName}'... done.`;
  } catch (err: unknown) {
    return `fatal: ${(err as Error).message}`;
  }
}

// git add <file>
export async function add(ctx: CommandContext): Promise<string> {

  const { args } = ctx;   // What files are we staging? ('.' for all files in cwd, or specific file paths)
  const dir = getCwd();   // Current working directory from Zustand store

  if (args.length == 0) return "git add: missing file operand. Use 'git add <file>' to specify a file, or 'git add .' to stage all files in the current directory.";

  try {
    // Isomorphic-Git can't handle '.' by default, so walk directory and add each file individually
    if (args[0] === ".") {
      // Get the status of all files in the directory
      const matrix = await git.statusMatrix({ fs, dir });

      // Filter for files that are modified, new (untracked), or deleted
      // row[1] = head, row[2] = workdir, row[3] = stage
      const filePaths = matrix
        .filter(row => row[2] !== row[3])
        .map(row => row[0]);

      for (const filepath of filePaths) {
        await git.add({ fs, dir, filepath });
      }
      return `added ${filePaths.length} files`;
    }

    // Add each specified file individually
    for (const filepath of args) {
      await git.add({ fs, dir, filepath });
    }
    return `added ${args.length} file(s)`;
  } catch (err: unknown) {
    const msg = (err as Error).message ?? '';
    if (msg.includes('ENOENT') || msg.includes('does not exist')) {
      return `fatal: pathspec '${args[0]}' did not match any files`;
    }
    return `error: ${msg}`;
  }
}


// git commit -m "message"
export async function commit(ctx: CommandContext): Promise<string> {
  const { flags, args } = ctx;

  if (flags.length == '0') return "";

  const message = args[0];

  if (!message) return "error: switch `m' requires a value";

  try {
    const sha = await git.commit({
      fs,
      dir: getCwd(),
      message,
      author: {
        name: "Student Learner",
        email: "student@example.local",
      },
    });
    // Return a message similar to the default git commit output, showing the first 7 characters of the commit SHA and the commit message
    return `[main ${sha.substring(0, 7)}] ${message}`;
  } catch {
    return `nothing to commit, working tree clean`;
  }
}

export async function push(ctx: CommandContext): Promise<string> {
  const { args } = ctx;
  const dir = getCwd();
  const remoteName = args[0] || 'origin';
  const branch = args[1] || 'main'; // Assume pushing to main for teaching

  try {
    // Read URL from the config
    const remotes = await git.listRemotes({ fs, dir });
    const remoteConfig = remotes.find(r => r.remote === remoteName);
    if (!remoteConfig) {
      return `fatal: '${remoteName}' does not appear to be a git repository\n` +
             `fatal: Could not read from remote repository.\n\n` +
             `hint: Did you run 'git remote add ${remoteName} <url>'?`;
    }

    // Translate to path for LightningFS.
    const localRemotePath = urlToPath(remoteConfig.url);
    if (!localRemotePath) return `fatal: invalid remote URL`;

    // Resolve the local branch SHA
    let localSha: string;
    try {
      // First try the branch name the user specified (or 'main')
      localSha = await git.resolveRef({ fs, dir, ref: `refs/heads/${branch}` });
    } catch {
      // If 'main' didn't work, check what branch HEAD actually points to
      try {
        const currentBranch = await git.currentBranch({ fs, dir });
        if (currentBranch && currentBranch !== branch) {
          return `error: src refspec '${branch}' does not match any\n` +
                 `hint: Your current branch is '${currentBranch}'. Did you mean:\n` +
                 `hint:   git push ${remoteName} ${currentBranch}`;
        }
      } catch { /* ignore */ }
      return `error: src refspec '${branch}' does not match any\n` +
             `error: failed to push some refs to '${remoteConfig.url}'`;
    }

    // Resolve the remote branch SHA (may not exist yet — first push)
    let remoteSha: string | null = null;
    try {
      remoteSha = await git.resolveRef({ fs, dir: localRemotePath, ref: `refs/heads/${branch}` });
    } catch { /* branch doesn't exist on remote yet */ }

    if (remoteSha === localSha) return 'Everything up-to-date';

    // Copy all objects the remote doesn't have. CREATE HELPER FUNCTION TO RECURSIVELY COPY.
    await copyMissingObjects(`${dir}/.git`, localRemotePath, localSha);

    // Update the remote's branch ref
    await git.writeRef({ fs, dir: localRemotePath, ref: `refs/heads/${branch}`, value: localSha, force: true });

    // Update the store so the UI knows to re-render
    useAppStore.getState().bumpRevision();

    // Return output similar to real git
    if (remoteSha === null) {
      return `To ${remoteConfig.url}\n * [new branch]      ${branch} -> ${branch}`;
    }
    return `To ${remoteConfig.url}\n   ${remoteSha.slice(0, 7)}..${localSha.slice(0, 7)}  ${branch} -> ${branch}`;

  } catch (err: unknown) {
    console.error('PUSH DEBUG:', err);
    return `error: failed to push some refs to '${remoteName}'\n${(err as Error).message}`;
  }

}

/**
 * git pull [<remote>] [<branch>]
 *
 * Copies objects from the remote bare repo into the local repo,
 * fast-forwards the local branch ref, and checks out the files.
 * Defaults to `origin` and `main`.
 */
export async function pull(ctx: CommandContext): Promise<string> {
  const { args } = ctx;
  const dir = getCwd();
  const remoteName = args[0] ?? 'origin';
  const branch     = args[1] ?? 'main';

  try {
    const remotes = await git.listRemotes({ fs, dir });
    const entry = remotes.find(r => r.remote === remoteName);
    if (!entry) {
      return `fatal: '${remoteName}' does not appear to be a git repository\n` +
             `fatal: Could not read from remote repository.\n\n` +
             `hint: Did you run 'git remote add ${remoteName} <url>'?`;
    }

    const bareDir = urlToPath(entry.url);
    if (!bareDir) return `fatal: repository '${entry.url}' not found`;
    if (!(await exists(fs, bareDir, 'dir'))) return `fatal: repository '${entry.url}' not found`;

    // Resolve remote branch SHA
    let remoteSha: string;
    try {
      remoteSha = await git.resolveRef({ fs, dir: bareDir, ref: `refs/heads/${branch}` });
    } catch {
      return `fatal: couldn't find remote ref ${branch}`;
    }

    // Resolve local branch SHA (may not exist yet)
    let localSha: string | null = null;
    try {
      localSha = await git.resolveRef({ fs, dir, ref: `refs/heads/${branch}` });
    } catch { /* no local branch yet */ }

    if (localSha === remoteSha) return 'Already up to date.';

    // Copy objects from remote into local
    await copyMissingObjects(bareDir, `${dir}/.git`, remoteSha);

    // Update local branch ref
    await git.writeRef({ fs, dir, ref: `refs/heads/${branch}`, value: remoteSha, force: true });

    // Make sure HEAD points at the branch
    await git.writeRef({ fs, dir, ref: 'HEAD', value: `refs/heads/${branch}`, force: true, symbolic: true });

    // Checkout the files into the working directory
    await git.checkout({ fs, dir, ref: branch, force: true });

    const shortLocal  = localSha ? localSha.slice(0, 7) : '0000000';
    const shortRemote = remoteSha.slice(0, 7);
    return `Updating ${shortLocal}..${shortRemote}\nFast-forward`;

  } catch (err: unknown) {
    return `error: ${(err as Error).message}`;
  }
}
