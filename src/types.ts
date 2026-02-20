export interface CommandContext {
  args: string[];                           // Positional arguments, e.g. ["file.txt", "dir/"]
  flags: Record<string, boolean | string>;  // Flags and options, e.g. { l: true, color: "red" }
  raw: string;                              // The original raw input string for reference.
}

export type CommandFn = (ctx: CommandContext) => string;
