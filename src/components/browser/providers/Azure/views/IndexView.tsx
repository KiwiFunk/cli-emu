import { Book, Plus, Funnel, Grid2X2Check, GitBranch, Rocket, FlaskConical, Boxes } from "lucide-react";
import { useRemoteIndex } from "@/hooks/useRemoteIndex";
import type { RepoIndexProps } from "@/types";

type RepoItemProps = {
  name: string;
  color: string;
  onClick: () => void;
  variant?: "list" | "card";
}

// Determine project icon color (use hash of repo name to have consistent color)
const ADO_COLORS = ['bg-[#0078D4]', 'bg-[#5C2D91]', 'bg-[#107C41]', 'bg-[#D83B01]', 'bg-[#A80000]', 'bg-[#008272]'];
const getProjectColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use modulo to loop within array and return color
  return ADO_COLORS[Math.abs(hash) % ADO_COLORS.length];
};

export default function AzureIndexView({ onSelectRepo, onNewRepo }: RepoIndexProps) {
  const { repoPaths, loading } = useRemoteIndex("https://dev.azure.com/user/project");

  const getDisplayName = (path: string) => path.split("/").pop()?.replace(".git", "") || path;

  // Extract first 3 repos for recent activity section (can update later)
  const recentRepos = repoPaths.slice(0, 3);

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

      {loading ? (
        <div className="py-12 text-center text-gray-500">
          Loading projects...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Recent Activity Cards */}
          {recentRepos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRepos.map((path) => {
                const name = getDisplayName(path);
                const color = getProjectColor(name);

                return (
                  <RepoItem
                    key={path}
                    name={name}
                    color={color}
                    variant="card"
                    onClick={() => onSelectRepo(path)}
                  />
                );
              })}
            </div>
          )}
          {/* Repo List */}
          {repoPaths.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm divide-y divide-gray-100">
              {repoPaths.map((path) => {
                const name = getDisplayName(path);
                const color = getProjectColor(name);

                return (
                  <RepoItem
                    key={path}
                    name={name}
                    color={color}
                    onClick={() => onSelectRepo(path)}
                  />
                );
              })}
            </div>
          )}

          {repoPaths.length === 0 && (
            <div className="py-20 flex flex-col items-center text-gray-500">
              <span className="text-lg font-semibold text-gray-700">
                No match found.
              </span>
              <button className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-sm text-sm">
                Reset filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RepoItem({
  name,
  color,
  onClick,
  variant = "list", // "list" | "card"
}: RepoItemProps) {
  const initial = name.charAt(0).toUpperCase();

  const isCard = variant === "card";

  return (
    <div
      onClick={onClick}
      className={`
        group cursor-pointer transition
        ${isCard
          ? "bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md p-5 flex flex-col h-40"
          : "flex items-center justify-between p-4 hover:bg-neutral-50"}
      `}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <div
          className={`
            ${isCard ? "w-12 h-12 text-xl" : "w-10 h-10 text-lg"}
            ${color}
            text-white flex items-center justify-center font-semibold rounded-sm shrink-0
          `}
        >
          {initial}
        </div>

        <div>
          <div
            className={`
              font-semibold text-gray-900 leading-tight transition-colors
              ${isCard ? "text-[16px] group-hover:text-[#0078D4]" : "text-[15px]"}
            `}
          >
            {name}
          </div>

          {/* Repos dont currently store a description
          <div className="text-[12px] text-gray-500 mt-1 line-clamp-2">
            {description}
          </div>
          */}

        </div>
      </div>

      {/* Action Buttons (+ Hover State) */}
      <div className={`flex ${variant === 'card' ? 'justify-end mt-auto' : 'gap-6 items-center'}`}>
          {/* dots */}
          <div className="flex gap-6 opacity-40 group-hover:hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gray-400"
              />
            ))}
          </div>

          {/* icons */}
          <div className="hidden group-hover:flex gap-2">
            <Grid2X2Check className="w-5 h-5 text-teal-500 stroke-[2.5]" />
            <GitBranch className="w-5 h-5 text-orange-600 stroke-[2.5]" />
            <Rocket className="w-5 h-5 text-sky-600 stroke-[2.5]" />
            <FlaskConical className="w-5 h-5 text-purple-600 stroke-[2.5]" />
            <Boxes className="w-5 h-5 text-pink-500 stroke-[2.5]" />
          </div>
        </div>

    </div>
  );
}
