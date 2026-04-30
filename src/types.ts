export interface CommandContext {
  subcmd?: string | null;                    // Subcommand if applicable, e.g. "commit" in "git commit"
  args: string[];                           // Positional arguments, e.g. ["file.txt", "dir/"]
  flags: Record<string, boolean | string>;  // Flags and options, e.g. { l: true, color: "red" }
  raw?: string | null;                      // The original raw input string for reference. (Optional)
}

export type CommandFn = (ctx: CommandContext) => Promise<string>;

// Glossary
export interface CommandOption {
  name: string;
  desc: string;
}

export interface CommandDef {
  command: string;
  description: string;
  flags?: CommandOption[]; // ? makes this property optional
  args?: CommandOption[];  // ? makes this property optional
}

// Remote Repo Interfaces

export interface CreateRepoFormProps {
  isPending: boolean;     // Indicates if the form submission is in progress
  error: string | null;   // Error message to display, or null if no error
  onSubmit: (name: string, addReadme: boolean) => Promise<void>;
}

export interface RepoViewProps {
  onNavigateToIndex?: () => void; // Navigate from repo view back to remote index
}
