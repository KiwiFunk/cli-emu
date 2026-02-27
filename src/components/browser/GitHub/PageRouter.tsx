import { useState } from "react";

// Import Pages
import CreateRepoForm from "./CreateRepoForm";
import GithubRepo from "./RepoView";
import EmptyState from "./EmptyRepo";

type ViewState = 'EMPTY' | 'CREATE_FORM' | 'REPO_VIEW';

function PageRouter() {

  const [view, setView] = useState<ViewState>('EMPTY');

  const handleCreateRepo = () => {
    setView('REPO_VIEW');
  };

  return (
    <>
      {(() => {
        switch (view) {
          case 'EMPTY':
          return <EmptyState openForm={() => setView('CREATE_FORM')} />;
          case 'CREATE_FORM':
            return <CreateRepoForm onSubmit={handleCreateRepo} />;
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
