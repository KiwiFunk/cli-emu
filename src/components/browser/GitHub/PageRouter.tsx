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

  // Check on mount if a repo already exists in /remote/
    useEffect(() => {
      hasRemoteRepo().then(exists => {
        if (exists) setView('REPO_INDEX');
      });
    }, []);

    const handleCreateRepo = async (name: string, addReadme: boolean) => {
      await createRepo(name, addReadme);
      setView('REPO_VIEW');
    };

  const handleSelectRepo = (repoDir: string) => {
    // Update the store with the selected repo directory
    useRepoStore.getState().setRepoDir(repoDir);
    setView('REPO_VIEW');
  }

  return (
    <>
      {(() => {
        switch (view) {
          case 'EMPTY':
            return <EmptyState openForm={() => setView('CREATE_FORM')} />;
          case 'CREATE_FORM':
            return <CreateRepoForm onSubmit={handleCreateRepo} />;
          case 'REPO_INDEX':
            return <RepoIndex onSelectRepo={handleSelectRepo} />;
          case 'REPO_VIEW':
            return <GithubRepo />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default PageRouter;
