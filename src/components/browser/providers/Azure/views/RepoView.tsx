import {
  GitBranch, ChevronDown, Folder, FileText,
  Search, Play, Copy, ArrowUp, MoreVertical, Maximize2
} from 'lucide-react';
import { useFileExplorer } from '@/hooks/useFileExplorer';
import type { RepoViewProps } from '@/types';

export default function AzureRepoView({ onNavigateToIndex }: RepoViewProps) {
  const {
    repoName, currentPath, entries, loading,
    handleNavigateToRoot, handleNavigateToPath, handleFileClick
  } = useFileExplorer();

  return (
    <div className="flex h-full w-full bg-white text-[13px] font-sans text-gray-800">

      {entries.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-start gap-6 p-6">
          {/* Repo Empty View - Maybe seperate into its own component? */}
          <div className="w-full">
            <span className="text-lg text-neutral-800 font-semibold">{repoName} is empty. Add some code!</span>
          </div>

          <div className="bg-white rounded-xs shadow-md w-full p-4">
            <div className="w-full text-[15px] font-semibold text-neutral-800">Clone to your computer</div>
          </div>

          <div className="bg-white rounded-xs shadow-md w-full p-4">
            <div className="w-full text-[15px] font-semibold text-neutral-800">Push an existing repository from command line</div>
          </div>

          <div>
          </div>

          <div>
          </div>

        </div>
      ) : (
      <>
      {/* Sidebar (File Tree) */}
      <div className="w-64 border-r border-gray-200 flex flex-col shrink-0 bg-neutral-50">
        <div className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-gray-100" onClick={handleNavigateToRoot}>
          <div className="flex items-center gap-2">
            <div className="text-[#D83B01]"><GitBranch size={16} /></div>
            <span className="font-semibold text-gray-900">{repoName}</span>
          </div>
          <MoreVertical size={14} className="text-gray-400" />
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Placeholder for gile tree - useFileExpolorer needs to have a recursive fetcher */}
          <div className="px-4 py-1.5 flex items-center gap-2 hover:bg-gray-100 cursor-pointer text-gray-600">
            <span className="text-[10px] bg-gray-200 px-1 rounded text-gray-500 font-mono">M!</span>
            <FileText size={14} />
            <span>README.md</span>
          </div>
        </div>
      </div>

      {/* Main Repo Window */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#faf9f8]">
          {/* Populated Repo */}

          {/* Breadcrumb / Search Bar */}
          <div className="h-10 flex items-center px-4 gap-3 shrink-0 text-gray-600">
            <div className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors">
              <GitBranch size={14} />
              <span className="font-semibold text-gray-900">main</span>
              <ChevronDown size={14} />
            </div>

            {/* Spacer  */}
            <div className="w-px h-4" />

            <div className="flex items-center gap-1 cursor-pointer" onClick={handleNavigateToRoot}>
              <Folder size={14} className="text-neutral-400 stroke-[2.5]" />
              <span className="text-gray-400">/</span>
            </div>

            {currentPath && (
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">{currentPath}</span>
                <span className="text-gray-400">/</span>
              </div>
            )}

            <div className="flex-1 flex items-center gap-2 ml-2">
              <input
                type="text"
                placeholder="Type to find a file or folder..."
                className="w-full outline-none text-neutral-700 placeholder-neutral-400 bg-transparent"
              />
            </div>
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto">

            {/* Header CTA */}
            <div className="px-6 py-4 flex justify-between items-center">
              <h1 className="text-[20px] font-semibold text-gray-900">Files</h1>
              <div className="flex items-center gap-2">
                <button className="bg-[#0078D4] hover:bg-[#005a9e] text-white px-3 py-1.5 rounded-sm font-semibold flex items-center gap-2 shadow-sm transition-colors">
                  <Play size={14} fill="currentColor" /> Set up build
                </button>
                <button className="bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-sm font-semibold flex items-center gap-2 transition-colors">
                  <Copy size={14} /> Clone
                </button>
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm ml-1">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 flex gap-6">
              <button className="pb-2 border-b-2 border-[#0078D4] text-[#0078D4] font-semibold">Contents</button>
              <button className="pb-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900">History</button>
            </div>

            {/* File Table Container */}
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 bg-[#faf9f8]">
                      <th className="px-4 py-2 font-normal w-1/3">
                        Name <ArrowUp size={12} className="inline ml-1" />
                      </th>
                      <th className="px-4 py-2 font-normal w-1/4">Last change</th>
                      <th className="px-4 py-2 font-normal">Commits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">Loading files...</td>
                      </tr>
                    ) : (
                      entries.map((entry) => (
                        <tr
                          key={entry.path}
                          onClick={handleFileClick(entry)}
                          className="hover:bg-gray-50 cursor-pointer group transition-colors"
                        >
                          <td className="px-4 py-2 flex items-center gap-2">
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">M!</span>
                            {entry.isDir ? (
                              <Folder size={16} className="text-[#0078D4] fill-[#0078D4]/20 shrink-0" />
                            ) : (
                              <FileText size={16} className="text-gray-400 shrink-0" />
                            )}
                            <span className="text-gray-900 group-hover:text-[#0078D4] font-medium truncate">
                              {entry.name}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600">Just now</td>
                          <td className="px-4 py-2 text-gray-600 truncate">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded mr-2 text-[11px] text-gray-500">
                              0a8963f
                            </span>
                            Added {entry.name} (Placeholder)
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* MD Preview (Placeholder) */}
              {!loading && entries.length > 0 && (
                <div className="mt-6 bg-white border border-gray-200 rounded-sm shadow-sm relative min-h-[400px]">
                  <div className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm cursor-pointer transition-colors z-10 bg-white shadow-sm border border-gray-200">
                    <Maximize2 size={14} />
                  </div>
                  <div className="p-8 prose prose-sm max-w-none text-gray-700">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">Introduction</h1>
                    <p className="mb-6">TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.</p>

                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Getting Started</h2>
                    <p className="mb-2">TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:</p>
                    <ol className="list-decimal pl-5 space-y-1 mb-6">
                      <li>Installation process</li>
                      <li>Software dependencies</li>
                      <li>Latest releases</li>
                      <li>API references</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
}
