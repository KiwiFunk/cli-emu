// Import Provider Routers
import GithubRouter from './providers/GitHub/PageRouter.tsx'
import AzureRouter from './providers/Azure/PageRouter'
import SelectProvider from './providers/SelectProvider'

import { useAppStore } from '@/store/useAppStore';

// Wrapper Component for Remote Providers
function RemoteBrowser() {

  const activeSkin =  useAppStore(state => state.remote)

  switch (activeSkin) {
    case 'GitHub':
      return <GithubRouter />;
    case 'Azure':
      return <AzureRouter />;
    default:
      return <SelectProvider />;
  }

}

export default RemoteBrowser;
