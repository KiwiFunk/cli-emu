import { useEffect, useState } from "react";
import { fetchRemoteRepos } from "@/lib/repo";
import { useAppStore } from "@/store/useAppStore";

export function useRemoteIndex(providerUrlBase: string = "https://remote.com/user") {
  const [repoPaths, setRepoPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Set app browser URL
  useEffect(() => {
    useAppStore.getState().setBrowserUrl(providerUrlBase);
  }, [providerUrlBase]);

  // Fetch the repos with isomorphic git and set in state
  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      const paths = await fetchRemoteRepos();
      setRepoPaths(paths);
      setLoading(false);
    };
    loadRepos();
  }, []);

  return {
    repoPaths,
    loading
  };
}
