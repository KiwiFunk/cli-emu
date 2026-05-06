import fs from '@/lib/fileSystem';
import type { CommandContext } from '@/types';
import { useAppStore } from '@/store/useAppStore';

/**
 * Safely updates or retrieves values from the emulator's /config.json file
 */
export async function config(ctx: CommandContext): Promise<string> {
  const { args } = ctx;

  if (args.length === 0) {
    return "usage: config [get|set] [key] [value]";
  }

  const action = args[0]; // "set" or "get"
  const key = args[1];
  const value = args[2];

  // Read current config
  let currentConfig: Record<string, any> = {};
  try {
    const data = await fs.promises.readFile('/config.json', 'utf8');
    currentConfig = JSON.parse(data as string);
  } catch (e) {
    // File doesnt exist, or corrupted - start with empty config
  }

  // Handle GET
  if (action === "get") {
    if (!key) {
      // If `config get`, return the whole file
      return JSON.stringify(currentConfig, null, 2);
    }
    return currentConfig[key] ? String(currentConfig[key]) : "";
  }

  // Handle SET
  if (action === "set") {
    if (!key || !value) return "usage: config set [key] [value]";

    // Update one specific key
    currentConfig[key] = value;

    // Write object back to the filesystem
    await fs.promises.writeFile('/config.json', JSON.stringify(currentConfig, null, 2), 'utf8');

    // Tell global store to sync the UI
    await useAppStore.getState().loadConfig();

    return `Config updated: ${key} = ${value}`;
  }

  return `config: unknown action '${action}'`;
}
