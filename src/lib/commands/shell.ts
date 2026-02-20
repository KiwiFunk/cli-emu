// Shell commands (ls, cd, mkdir, touch, cat, echo etc.)

import { useTerminalStore } from "../../store/useTerminalStore.ts";
import fs from '../fileSystem.ts';

import type { CommandContext } from "../../types.ts";

/**
 * Lists directory contents.
 * Supports: -a (all), -l (long format), and custom paths.
 */
export async function ls(ctx: CommandContext): Promise<string> {

  const { flags, args } = ctx;        // Deconstruct flags and args from context.

  // Use Double NOT (!!) to ensure we get a real bool
  const showHidden = !!flags.a;
  const longFormat = !!flags.l;

  const targetDir = args[0] || ".";             // Get target directory (first positional argument or current)
  const cwd = useTerminalStore.getState().cwd;  // Get current working directory from Zustand store

  // Resolve target directory against current working directory
  const path = targetDir == "."
    ? cwd
    : `${cwd}/${targetDir}`.replace(/\/+/g, '/');

  // LightningFS operations must be used with async/await
  try {
    // Await directory contents from query
    const contents = await fs.promises.readdir(path);

    // Filter hidden files if -a is not set
    const filtered = showHidden ? contents : contents.filter((name: string) => !name.startsWith('.'));

    // Format output based on -l flag
    if (longFormat) {

      // Await each file to build output lines with type, size, and name
      const lines = await Promise.all(
        // Map over filtered contents
        filtered.map(async (name) => {
          const filePath = `${path}/${name}`.replace(/\/+/g, '/');
          const stats = await fs.promises.stat(filePath);

          const type = stats.type === 'dir' ? 'd' : '-';
          const size = stats.size.toString().padStart(8, ' ');
          return `${type} ${size} ${name}`;
        })
      );
      // Join lines with newlines for long format output
      return lines.join('\r\n');
    }

    // If not long format, just join names with spacing
    return filtered.join('  ');

  } catch {
    // If fs operations fail (e.g. path doesn't exist), return error message
    return `ls: cannot access '${targetDir}': No such file or directory`;
  }
};

// Zustand provides .getState() and .setState() functions to access/update outside of React.
export async function pwd(): Promise<string>  {
  const cwd = useTerminalStore.getState().cwd;
  return `Path\r\n----\r\n${cwd}`;
}

export async function touch(ctx: CommandContext): Promise<string> {
  const { args } = ctx;

  if (args.length === 0) {
    return "touch: missing file operand";
  }

  const results = await Promise.all(
    args.map(async(arg) => {
      if (arg.includes('/')) {
        return `touch: invalid file name '${arg}': File name cannot contain '/'`;
      }

      const filename = arg;

      const cwd = useTerminalStore.getState().cwd;
      const path = `${cwd}/${filename}`.replace(/\/+/g, '/');

      try {
        await fs.promises.writeFile(path, ""); // Create empty file
        return ""; // No output on success
      } catch {
        return `touch: cannot create file '${filename}': No such directory`;
      }
    })
  );
  // Only return error messages. If all succeeded, return empty string.
  return results.filter(r => r !== "").join('\n');
};

export async function cd(ctx: CommandContext): Promise<string> {
  const { args } = ctx;

  if (args.length === 0) return "cd: missing operand";

  const targetDir = args[0];
  const state = useTerminalStore.getState();    // Get current state to access cwd and setCwd
  const cwd = state.cwd;                        // Current working directory


  if (targetDir === ".") return "";             // Cwd - return

  if (targetDir === "..") {                     // Parent directory (Check if we're at root first)
    if (cwd === "/") return "";
    const parent = cwd.split('/').slice(0, -1).join('/') || '/';
    state.setCwd(parent);
    return "";
  }

  // Resolve Path (Absolute vs Relative)
  let fullPath: string;

  if (targetDir.startsWith('/')) {
    // Absolute path: use as is, but clean up double slashes
    fullPath = targetDir.replace(/\/+/g, '/');
  } else {
    // Relative path: join with current directory
    fullPath = (cwd === '/' ? `/${targetDir}` : `${cwd}/${targetDir}`).replace(/\/+/g, '/');
  }

  // Remove trailing slash unless it's the root
  if (fullPath.length > 1 && fullPath.endsWith('/')) {
    fullPath = fullPath.slice(0, -1);
  }

  // Validate the target path exists and is a directory
  try {
    const stats = await fs.promises.stat(fullPath);       // stat only resolves if path exists.
    if (stats.type !== 'dir') {
      return `cd: ${targetDir}: Not a directory`;
    }

    // Update state
    state.setCwd(fullPath);
    return "";

  } catch {
    return `cd: ${targetDir}: No such file or directory`;
  }

}

// Future commands to implement:
// cd(path: string): void
// mkdir(path: string): void
// touch(path: string): void
// cat(path: string): string
// echo(text: string): void
