import git from 'isomorphic-git';
import fs from '../fileSystem';
import { getCwd } from "../../store/useTerminalStore.ts";
import type { CommandContext } from "../../types.ts";

// git init
await git.init({
  fs,             // LightningFS instance
  dir: getCwd()   // from Zustand store
});

// git add <file>

// git commit -m "message"

// git pull

// git push
