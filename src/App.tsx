// Component Imports
import SplitView from './components/layout/SplitView'
import initFs from './lib/initFs.ts';
import { useEffect, useState } from 'react';

function App() {

  const [fsReady, setFsReady] = useState(false);

  // Initialize the file system on component mount.
  useEffect(() => {
      initFs().then(() => setFsReady(true));
    }, [])

  return (
    <>
      <SplitView className="p-4" fsInit={fsReady} />
    </>
  )
}

export default App
