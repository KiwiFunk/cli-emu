// Command dispatcher - (receives raw string, routes it)


/**
 * Takes in a raw command string, and parses it into an array of command and arguments.
 * @param input - The raw command string entered by the user.
 * @returns - Array containing command and args ["ls", "-la", "/home"]  [0] = command, [1] = flag, [2] = path
 */
export function parseCommand(input: string) {
  const args = input.trim().split(" "); // Split input string into an array of parts, e.g. "ls -la /home" => ["ls", "-la", "/home"]
  const command = args.shift() || "";   // Extract the first element as the command, e.g. "ls", and remove it from the args array.
  dispatchCommand(command, ...args);    // Dispatch the command
}


/**
 * Dispatches the command to the appropriate handler function based on the command name.
 * @param command - The command to execute, e.g. "ls", "cd", "mkdir", etc.
 * @param args[] - Array of arguments passed to the command, e.g. ["-la", "/home"] for "ls -la /home"
 * @returns - The output of the command, which can be a string or an object depending on the command.
 *
 */
function dispatchCommand(cmd: string, ...args: string[]) {

  if (!cmd) {
    console.log("No command entered");
    return;
  }

  switch (cmd) {
    case "ls":
      // Call the ls command handler with the provided arguments
      console.log("Executing ls with args:", args);
      console.log("ls not yet implemented");
      break;
    default:
      // Handle unknown command
      console.log(`command not found: ${cmd}`);
      break;
  }
}
