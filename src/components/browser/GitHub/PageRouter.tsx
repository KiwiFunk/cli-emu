import { useState, useEffect } from "react";
import { hasRemoteRepo, createRepo } from "../../../lib/repo";
import { useRepoStore } from "../../../store/useRepoStore";

// Import Pages
import CreateRepoForm from "./CreateRepoForm";
import RepoIndex from "./RepoIndex";
import GithubRepo from "./RepoView";
import EmptyState from "./EmptyRepo";

type ViewState = 'EMPTY' | 'CREATE_FORM' | 'REPO_INDEX' | 'REPO_VIEW';

function PageRouter() {
  const [view, setView] = useState<ViewState>('EMPTY');

  // Helper to set view AND url in store
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
    useRepoStore.getState().setRepoDir(repoDir);  // Set the selected repo in the store
    navigate('REPO_VIEW');
  };

  return (
    <>
      {(() => {
        switch (view) {
          case 'EMPTY':
            return <EmptyState openForm={() => navigate('CREATE_FORM')} />;
          case 'CREATE_FORM':
            return <CreateRepoForm onSubmit={handleCreateRepo} />;
          case 'REPO_INDEX':
            return <RepoIndex
              onSelectRepo={handleSelectRepo}
              onNewRepo={() => navigate('CREATE_FORM')}
            />;
          case 'REPO_VIEW':
            return <GithubRepo onNavigateToIndex={() => navigate('REPO_INDEX')} />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default PageRouter;
