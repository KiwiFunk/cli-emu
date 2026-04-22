// Import Provider Routers
import GithubRouter from './providers/GitHub/PageRouter.tsx'
import AzureRouter from './providers/Azure/PageRouter'

// Wrapper Component for Remote Providers
function RemoteBrowser() {

  const activeSkin = 'github';  // pull from Zustand Store

  switch (activeSkin) {
    case 'github':
      return <GithubRouter />;
    case 'azure':
      return <AzureRouter />;
  }

}

export default RemoteBrowser;
