import * as shell from "./shell";

// Import type definitions
import type { CommandContext, CommandFn } from "../../types.ts";

/**
 *  Parse the input string into a command and its context.
 * @param String input - The raw command string entered by the user.
 * @returns - An object containing the command and a context object containing arguments, flags, and the raw input.
 */
function parseInput(input: string): { cmd: string; ctx: CommandContext } {

  // Split string into parts, respecting quoted substrings, or return empty array if no matches. E.g `ls -la "My Documents"` => ["ls", "-la", "My Documents"]
  const matches = input.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) || [];

  // Clean up single and double quotes.
  const parts = matches.map(m => m.replace(/^['"]|['"]$/g, ""));

  // Extract command (first part) and normalize to lowercase. If no parts, default to empty string.
  const cmd = parts.shift()?.toLowerCase() || "";

  const flags: Record<string, boolean | string> = {};
  const args: string[] = [];

  parts.forEach(part => {

    // Process flags into a key-value object. E.g --color=red => { color: "red" }, or --a => { a: true }
    if (part.startsWith("--")) {
      const [key, value] = part.replace("--", "").split("=");
      flags[key] = value ?? true;
    } else if (part.startsWith("-") && part.length > 1) {
      // Handles -la as { l: true, a: true }
      part.slice(1).split("").forEach(char => flags[char] = true);
    }
    // Otherwise, it's a positional argument. E.g ls -la /home => args = ["/home"]
    else {
      args.push(part);
    }
  });

  return { cmd, ctx: { args, flags, raw: input } };
}

/**
 * Dispatch a command from a given input string.
 * This function is the entry point for processing user input and routing it to the appropriate command handler.
 * @param String input - The raw command string entered by the user.
 * @returns - The output string from the command handler, or an error message if the command is not found or fails.
 */
export async function dispatchCommand(input: string): Promise<string> {

  // Parse input and deconstruct command and context.
  const { cmd, ctx } = parseInput(input);

  if (!cmd) return "";

  // Dict mapping command strings to their handler functions.
  const commands: Record<string, CommandFn> = {
    "ls": shell.ls,
    "pwd": shell.pwd,
    "mkdir": shell.mkdir,
    "touch": shell.touch,
    "cd": shell.cd,
    "help": () => Promise.resolve("Available: ls, cd, pwd, touch, help"),
  };

  // Look up the command handler in the dict. If not found, return error message.
  const handler = commands[cmd];

  if (!handler) {
    return `Command not found: ${cmd}. Type 'help' for options.`;
  }

  // Dispatch to the handler with context.
  try {
    return handler(ctx);
  } catch (err) {
    console.error(err);
    return `Error: Failed to execute ${cmd}`;
  }
}
