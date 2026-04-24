import { useState, useEffect } from "react";
import { hasRemoteRepo, createRepo } from "@/lib/repo";
import { useRepoStore } from "@/store/useRepoStore";
import { useAppStore } from '@/store/useAppStore';

// GitHub
import GitHubCreateRepoForm from "./GitHub/CreateRepoForm";
import GitHubRepoIndex from "./GitHub/RepoIndex";
import GitHubRepoView from "./GitHub/RepoView";
import GitHubEmptyState from "./GitHub/EmptyRepo";

// Azure DevOps (ADO)
// import AzureRepoIndex from "./Azure/RepoIndex";

import SelectProvider from './SelectProvider'

type ViewState = 'EMPTY' | 'CREATE_FORM' | 'REPO_INDEX' | 'REPO_VIEW';

export default function RemoteRouter() {
  const activeSkin = useAppStore(state => state.remote);
  const [view, setView] = useState<ViewState>('EMPTY');

  const navigate = (newView: ViewState) => {
    setView(newView);
  };

  useEffect(() => {
    hasRemoteRepo().then(exists => {
      if (exists) navigate('REPO_INDEX');
    });
  }, []);

  const handleCreateRepo = async (name: string, addReadme: boolean) => {
    await createRepo(name, addReadme);
    navigate('REPO_VIEW');
  };

  const handleSelectRepo = (repoDir: string) => {
    useRepoStore.getState().setRepoDir(repoDir);
    navigate('REPO_VIEW');
  };

  // --- RENDERING LOGIC ---
  if (activeSkin === 'GitHub') {
    return (
      <>
        {view === 'EMPTY' && <GitHubEmptyState openForm={() => navigate('CREATE_FORM')} />}
        {view === 'CREATE_FORM' && <GitHubCreateRepoForm onSubmit={handleCreateRepo} isPending={false} error={null} />}
        {view === 'REPO_INDEX' && <GitHubRepoIndex onSelectRepo={handleSelectRepo} onNewRepo={() => navigate('CREATE_FORM')} />}
        {view === 'REPO_VIEW' && <GitHubRepoView onNavigateToIndex={() => navigate('REPO_INDEX')} />}
      </>
    );
  }

  if (activeSkin === 'Azure') {
    return (
      <div className="p-8 text-white">
         <h1>ADO</h1>
         {/* ADO Pages Here */}
      </div>
    );
  }

  // If no valid provider is selected, show selection
  return <SelectProvider />;
}
