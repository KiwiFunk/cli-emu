import { useState, useEffect, useCallback } from 'react';
import { useRepoStore } from '@/store/useRepoStore';
import { useAppStore } from '@/store/useAppStore';
import { getFileTree } from '@/lib/repo';

export interface TreeEntry {
  name: string;
  isDir: boolean;
  path: string;
}

export function useFileExplorer() {
  const repoDir = useRepoStore(state => state.repoDir);
  const gitRevision = useAppStore(state => state.gitRevision);
  const repoName = repoDir ? repoDir.split('/').pop()?.replace('.git', '') : 'my-cool-repo';

  const [currentPath, setCurrentPath] = useState<string>("");
  const [entries, setEntries] = useState<TreeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Get File Tree (Isomorphic Git handles the .git file)
  useEffect(() => {
    const loadFiles = async () => {
      if (!repoDir) return;
      setLoading(true);
      const data = await getFileTree(repoDir, 'main', currentPath);
      setEntries(data);
      setLoading(false);
    };

    loadFiles();
  }, [repoDir, currentPath, gitRevision]);

  // Set URL to match current repo/path
  useEffect(() => {
    let url = `https://github.com/user/${repoName}`; // Logic needs updating to handle different remotes and repo structures
    if (currentPath) {
      url += `/${currentPath}`;
    }
    useAppStore.getState().setBrowserUrl(url);
  }, [repoName, currentPath]);

  // Navigation Actions
  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  // UseCallback to memoize navigation handlers and prevent unnecessary re-renders
  const handleNavigateToRoot = useCallback(() => {
    navigateTo("");
  }, [navigateTo]);

  const handleNavigateToPath = useCallback((path: string) => () => {
    navigateTo(path);
  }, [navigateTo]);

  const handleFileClick = useCallback((entry: TreeEntry) => () => {
    if (entry.isDir) {
      navigateTo(entry.path);
    } else {
      console.log("Open file:", entry.path);
    }
  }, [navigateTo]);

  // Return everything the UI needs
  return {
    repoName,
    currentPath,
    entries,
    loading,
    navigateTo,
    handleNavigateToRoot,
    handleNavigateToPath,
    handleFileClick
  };
}
