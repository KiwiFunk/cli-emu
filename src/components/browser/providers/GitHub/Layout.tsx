import {
  Menu, Plus, CircleDot, GitPullRequest, Book, Inbox, Search,
  Code, Play, LayoutPanelLeft, BookOpen, Shield, LineChart, Settings
} from "lucide-react";
import type { SkinLayoutProps } from "@/types";
import { useFileExplorer } from "@/hooks/useFileExplorer";

export default function GitHubLayout({ children, currentView, onNavigateHome }: SkinLayoutProps) {
  // We can grab the repo name straight from our hook!
  const { repoName, handleNavigateToRoot } = useFileExplorer();

  const isRepoContext = currentView.activePage === 'REPO';

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">

      {/* 1. GLOBAL TOP BAR (Always Visible) */}
      <header className="bg-[#010409] border-b border-[#30363d] px-4 py-3 flex items-center justify-between">

        {/* Left Side - Logo & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button className="text-[#8b949e] hover:text-[#c9d1d9] border border-[#30363d] p-1.5 rounded-md">
            <Menu size={16} />
          </button>

          {/* GitHub Logo */}
          <div className="w-8 h-8 rounded-full">
            {/* https://simpleicons.org */}
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-white"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </div>

          {/* Dynamic Breadcrumbs */}
          <div className="flex items-center gap-1 font-semibold text-sm">
            <span
              className="hover:bg-[#161b22] px-2 py-1 rounded-md cursor-pointer transition-colors"
              onClick={onNavigateHome}
            >
              Username
            </span>
            {isRepoContext && (
              <>
                <span className="text-[#8b949e] font-normal">/</span>
                <span
                  className="hover:bg-[#161b22] px-2 py-1 rounded-md cursor-pointer transition-colors"
                  onClick={handleNavigateToRoot}
                >
                  {repoName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Search & Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Mock Search Bar */}
          <div className="flex items-center gap-2 border border-[#30363d] bg-[#0d1117] rounded-md px-2 py-1 text-sm text-[#8b949e] w-64">
            <Search size={14} />
            <span className="flex-1">Type / to search</span>
          </div>

          <div className="flex items-center gap-1 border-l border-[#30363d] pl-2 ml-2 text-[#8b949e]">
            <button className="p-1.5 hover:text-[#c9d1d9]"><Plus size={16} /></button>
            <button className="p-1.5 hover:text-[#c9d1d9]"><CircleDot size={16} /></button>
            <button className="p-1.5 hover:text-[#c9d1d9]"><GitPullRequest size={16} /></button>
            <button className="p-1.5 hover:text-[#c9d1d9]"><Book size={16} /></button>
            <button className="p-1.5 hover:text-[#c9d1d9] relative">
              <Inbox size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#58a6ff] rounded-full border-2 border-[#010409]"></span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. CONTEXTUAL SUB-NAV (Only visible in a Repo) */}
      {isRepoContext && (
        <nav className="bg-[#010409] border-b border-[#30363d] px-4 pt-3 flex gap-2 overflow-x-auto">
          <Tab icon={<Code size={16} />} label="Code" active />
          <Tab icon={<CircleDot size={16} />} label="Issues" />
          <Tab icon={<GitPullRequest size={16} />} label="Pull requests" />
          <Tab icon={<Play size={16} />} label="Actions" />
          <Tab icon={<LayoutPanelLeft size={16} />} label="Projects" />
          <Tab icon={<BookOpen size={16} />} label="Wiki" />
          <Tab icon={<Shield size={16} />} label="Security" />
          <Tab icon={<LineChart size={16} />} label="Insights" />
          <Tab icon={<Settings size={16} />} label="Settings" />
        </nav>
      )}

      {/* 3. MAIN CONTENT (The active view is rendered here!) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

// Small helper for the sub-nav tabs
const Tab = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`
    flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap transition-colors
    ${active
      ? 'text-[#f0f6fc] border-b-2 border-[#f78166] font-medium'
      : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9] rounded-t-md border-b-2 border-transparent'
    }
  `}>
    {icon} {label}
  </button>
);
