// Import commands
import * as shell from "./shell";

// TS Type Definitions
type CommandFn = (...args: string[]) => string;

/**
 * Takes in a raw command string, and parses it into an array of command and arguments.
 * @param input - The raw command string entered by the user.
 * @returns - text output to be displayed in the terminal.
 */
export function parseCommand(input: string) {
  const args = input.trim().split(" ");     // Split input string into an array of parts, e.g. "ls -la /home" => ["ls", "-la", "/home"]
  const command = args.shift() || "";       // Extract the first element as the command, e.g. "ls", and remove it from the args array.
  return dispatchCommand(command, ...args); // Dispatch the command
}

/**
 * Dispatches the command to the appropriate handler function based on the command name.
 * @param command - The command to execute, e.g. "ls", "cd", "mkdir", etc.
 * @param args[] - Array of arguments passed to the command, e.g. ["-la", "/home"] for "ls -la /home"
 * @returns - The result of the command execution.
 */
function dispatchCommand(cmd: string, ...args: string[]) {

  if (!cmd) return;

  // Dictionary of supported commands and their handlers
  const commands: Record<string, CommandFn> = {
    "ls": shell.ls,
    //"cd": shell.cd,
  };

  const commandFn = commands[cmd];            // Look up the command in the dictionary

  // Execute logic and return text output to calling function, which will then be displayed in the terminal.
  if (commandFn) {
    return commandFn(...args);
  } else {
    return `Command not found: ${cmd}`;
  }
}
