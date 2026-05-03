import { Book, Plus, Funnel } from "lucide-react";
import { useRemoteIndex } from "@/hooks/useRemoteIndex";
import type { RepoIndexProps } from "@/types";

export default function AzureIndexView({ onSelectRepo, onNewRepo }: RepoIndexProps) {
  const { repoPaths, loading } = useRemoteIndex("https://dev.azure.com/user/project");

  const getDisplayName = (path: string) => path.split("/").pop()?.replace(".git", "") || path;

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">

      {/* Section Header */}
      <div className="w-full flex-row gap-3 items-center mb-6">

        {/* Org Name / CTA Buttons */}
        <div className="flex justify-between items-center gap-4 w-full">
          {/* Organization Name - Hardcode for now as orgs are not in scope */}
          <h1 className="text-2xl font-semibold text-neutral-800">gitsim</h1>
          <button
            onClick={onNewRepo}
            className="bg-sky-600 hover:bg-sky-700 text-white cursor-pointer px-3 py-1.75 rounded-xs text-sm font-semibold flex items-center gap-3"
          >
            <Plus size={20} /> New project
          </button>
        </div>

        {/* Tabs and Filters */}
        <div className="flex justify-between items-center gap-4 w-full pt-4">

          <div className="flex items-center gap-4">
            <button className="py-2 text-sm text-gray-800 hover:text-gray-800 transition-colors font-semibold border-b-2 border-sky-500 ">
              Projects
            </button>
            <button className="py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              My work items
            </button>
            <button className="py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              My pull requests
            </button>
          </div>

          <div className="flex bg-neutral-200 items-center gap-2 px-2 py-1 text-sm text-gray-500 w-64 transition-colors">
            <Funnel size={16} className="text-gray-500" />
            <span className="flex-1 outline-none text-gray-600 bg-transparent">
              Filter projects
            </span>
          </div>

        </div>
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
