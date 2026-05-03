import {
  Search, Plus, Bell, User, Book,
  Settings, Rocket, LayoutDashboard, ChevronRight,
  List, ShoppingBag, HelpCircle, UserCog // <-- Add these new ones!
} from "lucide-react";

import type { SkinLayoutProps } from "@/types";
import { useFileExplorer } from "@/hooks/useFileExplorer";


export default function AzureLayout({ children, currentView, onNavigateHome }: SkinLayoutProps) {
  const { repoName } = useFileExplorer();
  const isRepoContext = currentView.activePage === 'REPO';

  return (
    <div className="flex flex-col h-full text-gray-200 font-sans text-sm">

      {/* Header */}
      <header className="shrink-0 w-full h-[48px] bg-white border-b border-gray-300 flex items-center justify-between px-4 z-10">
        {/* Left Side */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onNavigateHome}
        >
          <img
            src="10261-icon-service-Azure-DevOps.svg"
            alt="Azure DevOps Logo"
            className="h-6 w-6"
          />

          {/* Render Title or Breadcrumbs */}
          { !isRepoContext ? (
          <span className="text-sky-600 font-bold text-[15px]">
            Azure DevOps
            </span>
          ) : (
            <span className="text-neutral-300 font-semibold text-[15px]">
              {repoName}
            </span>
          )}

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Search Bar */}
          <div className="flex items-center gap-2 border border-gray-400 hover:border-gray-500 bg-white px-2 py-1 text-sm text-gray-500 w-64 transition-colors">
            <Search size={14} className="text-gray-500" />
            <span className="flex-1 outline-none text-gray-600 bg-transparent">
              Search
            </span>
          </div>

          {/* Top Nav Icons */}
          <div className="flex items-center gap-4 text-gray-600">
            <List size={18} className="cursor-pointer hover:text-gray-800" />
            <ShoppingBag
              size={18}
              className="cursor-pointer hover:text-gray-800"
            />
            <HelpCircle
              size={18}
              className="cursor-pointer hover:text-gray-800"
            />
            <UserCog size={18} className="cursor-pointer hover:text-gray-800" />
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
            GS
          </div>
        </div>
      </header>

      {/* Content Wrapper */}
      <div className="flex flex-1 min-h-0 bg-white">

        {/* SIDEBAR */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-300 flex flex-col py-4">
          {/* Conditionally render depending on rendered page */}

          {/* No Project (Repo) - Selected, display organizations  */}
          {!isRepoContext && (
            <>
              <div className="h-10 flex items-center px-4 hover:bg-sky-200 bg-sky-100 cursor-pointer transition-colors" onClick={onNavigateHome}>
                <div className="w-6 h-6 bg-sky-700 rounded flex items-center justify-center mr-3 text-white text-xs">
                  G
                </div>
                <span className="text-gray-800">gitsim</span>
              </div>

              <div className="h-12 flex items-center px-4 cursor-pointer transition-colors">
                <span className="text-sky-600 hover:text-sky-800">New organization</span>
              </div>
            </>
          )}

          {/* Project (Repo) - Selected, display sidebar icons  */}
          {isRepoContext && (
            <>
            </>
          )}
        </aside>

        {/* Page Content */}
        <main className="flex overflow-auto w-full bg-neutral-100">
          {children}
        </main>

      </div>
    </div>
  );
}
