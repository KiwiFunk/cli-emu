import { useState, useEffect, useActionState } from "react";
import { hasRemoteRepo, createRepo } from "@/lib/repo";
import { useRepoStore } from "@/store/useRepoStore";
import { useAppStore } from '@/store/useAppStore';

// GitHub
import GitHubCreateRepoForm from "./GitHub/CreateRepoForm";
import GitHubRepoIndex from "./GitHub/RepoIndex";
import GitHubRepoView from "./GitHub/RepoView";
import GitHubEmptyState from "./GitHub/EmptyRepo";

//import AzureCreateRepoForm from "./Azure/CreateRepoForm";
import AzureRepoIndex from "./Azure/RepoIndex";
//import AzureRepoView from "./Azure/RepoView";
//import AzureEmptyState from "./Azure/EmptyRepo";

// Azure DevOps (ADO)
// import AzureRepoIndex from "./Azure/RepoIndex";

import SelectProvider from './SelectProvider'

type ProviderSkin = {
  EmptyState: React.ElementType<{ openForm: () => void }>;
  CreateRepoForm: React.ElementType<any>; // Update with types from types.ts
  RepoIndex: React.ElementType<{ onSelectRepo: (dir: string) => void; onNewRepo: () => void }>;
  RepoView: React.ElementType<{ onNavigateToIndex: () => void }>;
  // Add any provider-specific components that don't fit the above categories
  ProviderSpecificExample?: React.ElementType<null>;
};

// Map All Providers/Skins to their Components
const providers: Record<string, ProviderSkin> = {
  GitHub: {
    EmptyState: GitHubEmptyState,
    CreateRepoForm: GitHubCreateRepoForm,
    RepoIndex: GitHubRepoIndex,
    RepoView: GitHubRepoView,
  },
  Azure: {
    //EmptyState: AzureEmptyState,
    //CreateRepoForm: AzureCreateRepoForm,
    RepoIndex: AzureRepoIndex,
    //RepoView: AzureRepoView,
  },
};

type ViewState = 'EMPTY' | 'CREATE_FORM' | 'REPO_INDEX' | 'REPO_VIEW';

export default function RemoteRouter() {
  const provider = useAppStore(state => state.remote);
  const [view, setView] = useState<ViewState>('EMPTY');

  const navigate = (newView: ViewState) => {
    setView(newView);
  };

  useEffect(() => {
    hasRemoteRepo().then(exists => {
      if (exists) navigate('REPO_INDEX');
    });
  }, []);

  const [createError, submitCreateRepo, isCreating] = useActionState(
    async (_previousState: string | null, formData: { name: string, addReadme: boolean }) => {
      try {
        await createRepo(formData.name, formData.addReadme);
        navigate('REPO_VIEW');
        return null;
      } catch (err: unknown) {
        if (err instanceof Error) return err.message;
        return "An unexpected error occurred.";
      }
    },
    null
  );

  const handleSelectRepo = (repoDir: string) => {
    useRepoStore.getState().setRepoDir(repoDir);
    navigate('REPO_VIEW');
  };

  // If no remote provider set
  if (!provider || !providers[provider]) {
    return <SelectProvider />;
  }

  // Get components from the selected remote provider/skin
  const RemoteComponents = providers[provider];

  return (
    <>
      {view === 'EMPTY' && (
        <RemoteComponents.EmptyState openForm={() => navigate('CREATE_FORM')} />
      )}

      {view === 'CREATE_FORM' && (
        <RemoteComponents.CreateRepoForm
          onSubmit={async (name: string, addReadme: boolean) => {
            submitCreateRepo({ name, addReadme });
          }}
          isPending={isCreating}
          error={createError}
        />
      )}

      {view === 'REPO_INDEX' && (
        <RemoteComponents.RepoIndex
          onSelectRepo={handleSelectRepo}
          onNewRepo={() => navigate('CREATE_FORM')}
        />
      )}

      {view === 'REPO_VIEW' && (
        <RemoteComponents.RepoView
          onNavigateToIndex={() => navigate('REPO_INDEX')}
        />
      )}
    </>
  );
}
