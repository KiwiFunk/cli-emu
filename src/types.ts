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

// Remote Router Interface
export interface RouterState {
  activePage: 'INDEX' | 'REPO' | 'CREATE';
  activeModal: 'CREATE' | null;
}

// Remote Providers
export interface SkinConfig {
  // Tell router how provider handles actions
  routingPreferences: {
    createAction: 'navigate_to_page' | 'open_modal';
  };

  // Shell / Persistant UI
  Layout: React.ElementType<{ children: React.ReactNode, currentView: RouterState }>;

  // Views
  IndexView: React.ElementType<RepoIndexProps>;
  RepoView: React.ElementType<RepoViewProps>;
  CreateView?: React.ElementType<CreateRepoFormProps>; // Optional, used if createAction is page

  // Overlay Elelemts (e.g. Modals)
  CreateModal?: React.ElementType<CreateRepoFormProps>; // Optional, used if createAction is modal
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

export interface RepoIndexProps {
  onSelectRepo: (repoDir: string) => void;  // Callback when a repo is selected from index
  onNewRepo: () => void;                    // Callback to navigate to the create repo form
}
