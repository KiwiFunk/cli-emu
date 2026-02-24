import git from 'isomorphic-git';
import fs from '../fileSystem';
import { getCwd } from "../../store/useTerminalStore.ts";
import type { CommandContext } from "../../types.ts";
import { resolvePath, exists } from './helpers.ts';
import { mkdir } from './shell.ts';

/**
 * Internal Git Router
 * Routes git commands using the subcmd property of the context.
 */
export async function main(ctx: CommandContext): Promise<string> {
  const { subcmd } = ctx;

  const subcommands: Record<string, (ctx: CommandContext) => Promise<string>> = {
    "init": init,
    //"add": add,
    "status": async () => "Status: Not yet implemented",
  };

  const handler = subcommands[subcmd || ""];
  if (!handler) return subcmd ? `git: '${subcmd}' is not a git command.` : "usage: git <command>";

  return await handler(ctx);
}

// Need to handle git init - create in getCwd
// git init <directory> Create if doesnt exist.
// git init
export async function init(ctx: CommandContext): Promise<string> {
  const { args } = ctx;

  // No directory specified, initialize in current working directory
  if (args.length === 0) {
    await git.init({
      fs,             // LightningFS instance
      dir: getCwd()   // from Zustand store
    });
    return "";
  }

  // Directory specified, initialize there.
  if (await exists(fs, args[0], "dir")) {
    await git.init({
      fs,
      dir: resolvePath(args[0])
    });
    return "";
  }

  // If it doesn't exist, create it first.
  else {
    await mkdir({ args: [args[0]], flags: { p: true } });
    await git.init({
      fs,
      dir: resolvePath(args[0])
    });
    return "";
  }
};


// git add <file>
/*
export async function add(ctx: CommandContext): Promise<string> {

  const { args } = ctx;

  // Isomorphic-Git can't handle '.' by default, so walk directory and add each file individually
  if (ctx.args == ".") {

  }

  try {
    return "";
  }

};
*/

// git commit -m "message"

// git pull

// git push
