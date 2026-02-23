import git from 'isomorphic-git';
import fs from '../fileSystem';
import { getCwd } from "../../store/useTerminalStore.ts";
import type { CommandContext } from "../../types.ts";




// Need to handle git init - create in getCwd
// git init <directory> Create if doesnt exist.
// git init
export async function init(ctx: CommandContext): Promise<string> {
  const { flags, args } = ctx;

  // No directory specified, initialize in current working directory
  if (args.length === 0) {

  }

  // CREATE 'EXISTS' function to check if directory exists, return bool
  // if doesnt exist, attempt to create

}

await git.init({
  fs,             // LightningFS instance
  dir: getCwd()   // from Zustand store
});

// git add <file>
export async function add(ctx: CommandContext): Promise<string> {

  const { args } = ctx;

  // Isomorphic-Git can't handle '.' by default, so walk directory and add each file individually
  if (ctx.args == ".") {

  }

  try {
    return "";
  }

};

// git commit -m "message"

// git pull

// git push
