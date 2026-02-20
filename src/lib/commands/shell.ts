// Shell commands (ls, cd, mkdir, touch, cat, echo etc.)

import { useTerminalStore } from "../../store/useTerminalStore.ts";
import fs from '../fileSystem.ts';

import type { CommandContext } from "../../types.ts";

/**
 * Lists directory contents.
 * Supports: -a (all), -l (long format), and custom paths.
 */
export const ls = (ctx: CommandContext): string => {

  const { flags, args } = ctx;        // Deconstruct flags and args from context.

  // Use Double NOT (!!) to ensure we get a real bool
  const showHidden = !!flags.a;
  const longFormat = !!flags.l;

  // Get target directory (first positional argument or current)
  const targetDir = args[0] || ".";

  // Resolve target directory against current working directory
  const cwd = useTerminalStore.getState().cwd;
  const path = fs.resolve(cwd, targetDir);

  // Get directory contents from our in-memory file system
  const contents = fs.readdir(path);

  if (!contents) {
    return `ls: cannot access '${targetDir}': No such file or directory`;
  }

  // Filter hidden files if -a is not set
  const filtered = showHidden ? contents : contents.filter((name: string) => !name.startsWith('.'));

  // Format output based on -l flag
  if (longFormat) {
    return filtered.map((name: string) => {
      const stats = fs.stat(fs.join(path, name));
      const type = stats.isDirectory() ? 'd' : '-';
      const size = stats.size.toString().padStart(10, ' ');
      return `${type} ${size} ${name}`;
    }).join('\n');
  }

  else {
    return filtered.join('  ');
  }

};

// Zustand provides .getState() and .setState() functions to access/update outside of React.
export function cwd() {
  return useTerminalStore.getState().cwd;
}

// Future commands to implement:
// cd(path: string): void
// mkdir(path: string): void
// touch(path: string): void
// cat(path: string): string
// echo(text: string): void
