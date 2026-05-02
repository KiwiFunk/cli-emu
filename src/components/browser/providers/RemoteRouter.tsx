import React, { useState, useEffect, useActionState } from "react";
import { hasRemoteRepo, createRepo } from "@/lib/repo";
import { useRepoStore } from "@/store/useRepoStore";
import { useAppStore } from '@/store/useAppStore';

import type { CreateRepoFormProps, RepoIndexProps, RepoViewProps, SkinLayoutProps, RouterState } from "@/types";

import SelectProvider from './SelectProvider'

// GITHUB SKIN
import GitHubLayout from "./GitHub/Layout";
import GitHubIndexView from "./GitHub/views/IndexView";
import GitHubRepoView from "./GitHub/views/RepoView";
import GitHubCreateView from "./GitHub/views/CreateView";
import GitHubEmptyView from "./GitHub/views/EmptyView";

// AZURE SKIN (WIP)
import AzureLayout from "./Azure/Layout";
import AzureIndexView from "./Azure/views/IndexView";
import AzureRepoView from "./Azure/views/RepoView";
import AzureCreateModal from "./Azure/components/CreateModal";
import AzureEmptyView from "./Azure/views/EmptyView";

export interface SkinConfig {

  // Tell router how provider handles actions
  routingPreferences: {
    createAction: 'navigate_to_page' | 'open_modal';
  };

  // Shell / Persistant UI
  Layout: React.ElementType<SkinLayoutProps>;

  // Views
  EmptyView: React.ElementType<{ openForm: () => void }>; // Props for empty state (e.g. "Create New Repo" button)
  IndexView: React.ElementType<RepoIndexProps>;
  RepoView: React.ElementType<RepoViewProps>;
  CreateView?: React.ElementType<CreateRepoFormProps>;  // Optional, used if createAction is page

  // Overlay Elelemts (e.g. Modals)
  CreateModal?: React.ElementType<CreateRepoFormProps>; // Optional, used if createAction is modal
}

// Map provider names to their skin configs
const providers: Record<string, SkinConfig> = {
  GitHub: {
    routingPreferences: { createAction: 'navigate_to_page' }, // GitHub uses a dedicated page
    Layout: GitHubLayout,
    EmptyView: GitHubEmptyView,
    IndexView: GitHubIndexView,
    RepoView: GitHubRepoView,
    CreateView: GitHubCreateView,
  },
  Azure: {
    routingPreferences: { createAction: 'open_modal' }, // Azure prefers modals for creation
    Layout: AzureLayout,
    EmptyView: AzureEmptyView,
    IndexView: AzureIndexView,
    RepoView: AzureRepoView,
    CreateModal: AzureCreateModal,
  }
};

export default function RemoteRouter() {
  const provider = useAppStore(state => state.remote);

  // Router State
  const [routerState, setRouterState] = useState<RouterState>({
    activePage: 'EMPTY',
    activeModal: null
  });

  const navigatePage = (page: RouterState['activePage']) => setRouterState(s => ({ ...s, activePage: page }));
  const openModal = (modal: RouterState['activeModal']) => setRouterState(s => ({ ...s, activeModal: modal }));
  const closeModal = () => setRouterState(s => ({ ...s, activeModal: null }));

  useEffect(() => {
    hasRemoteRepo().then(exists => {
      if (exists) navigatePage('INDEX');
    });
  }, []);

  const [createError, submitCreateRepo, isCreating] = useActionState(
    async (_previousState: string | null, formData: { name: string, addReadme: boolean }) => {
      try {
        await createRepo(formData.name, formData.addReadme);
        navigatePage('REPO');
        closeModal(); // Ensure any open modals close!
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
    navigatePage('REPO');
  };

  if (!provider || !providers[provider]) return <SelectProvider />;

  const Skin = providers[provider];

  // Handle Page Navigation vs Modal Opening based on provider preferences
  const handleNewRepoClick = () => {
    if (Skin.routingPreferences.createAction === 'open_modal') {
      openModal('CREATE');
    } else {
      navigatePage('CREATE');
    }
  };

  return (
    <Skin.Layout currentView={routerState} onNavigateHome={() => navigatePage('INDEX')}>

      {/* Views */}
      {routerState.activePage === 'EMPTY' && <Skin.EmptyView openForm={handleNewRepoClick} />}

      {routerState.activePage === 'INDEX' && <Skin.IndexView onSelectRepo={handleSelectRepo} onNewRepo={handleNewRepoClick} />}

      {routerState.activePage === 'REPO' && <Skin.RepoView onNavigateToIndex={() => navigatePage('INDEX')} />}

      {routerState.activePage === 'CREATE' && Skin.CreateView && (
        <Skin.CreateView
          onSubmit={async (name, addReadme) => submitCreateRepo({ name, addReadme })}
          isPending={isCreating}
          error={createError}
        />
      )}

      {/* Overlays */}
      {routerState.activeModal === 'CREATE' && Skin.CreateModal && (
        <Skin.CreateModal
          onSubmit={async (name, addReadme) => submitCreateRepo({ name, addReadme })}
          isPending={isCreating}
          error={createError}
        />
      )}

    </Skin.Layout>
  );
}
