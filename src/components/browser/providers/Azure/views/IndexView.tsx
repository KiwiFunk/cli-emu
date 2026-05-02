import { Book, Plus } from "lucide-react";
import { useRemoteIndex } from "@/hooks/useRemoteIndex";
import type { RepoIndexProps } from "@/types";

export default function AzureIndexView({ onSelectRepo, onNewRepo }: RepoIndexProps) {
  const { repoPaths, loading } = useRemoteIndex("https://dev.azure.com/user/project");

  const getDisplayName = (path: string) => path.split("/").pop()?.replace(".git", "") || path;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Repositories</h1>
        <button
          onClick={onNewRepo}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> New repository
        </button>
      </div>

      <div className="bg-[#111018] border border-gray-800 rounded-md shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {repoPaths.map((path) => (
              <div
                key={path}
                onClick={() => onSelectRepo(path)}
                className="flex items-center p-4 hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <Book className="text-blue-500 mr-4" size={20} />
                <div>
                  <div className="text-blue-500 font-semibold group-hover:underline">
                    {getDisplayName(path)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{path}</div>
                </div>
              </div>
            ))}
            {repoPaths.length === 0 && (
              <div className="p-8 text-center text-gray-500">No repositories found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
