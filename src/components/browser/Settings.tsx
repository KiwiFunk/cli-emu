import { useEffect } from "react";
import { Save, TerminalSquare, Github, LayoutTemplate } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function Settings() {
  const { remote, username, setRemote, setUsername, loadConfig } = useAppStore();

  // Load the config from the filesystem when the tab opens
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans text-slate-800">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <TerminalSquare size={24} />
        </div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-8 bg-slate-50 p-6 rounded-xl border border-slate-200">

        {/* Remote Provider Selection */}
        <div className="space-y-3">

          <span className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Remote Provider
          </span>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRemote('GitHub')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                remote === 'GitHub'
                  ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <Github size={24} className={remote === 'GitHub' ? 'text-indigo-600' : 'text-slate-500'} />
              <span className="font-semibold text-lg">GitHub</span>
            </button>

            <button
              onClick={() => setRemote('Azure')}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                remote === 'Azure'
                  ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <LayoutTemplate size={24} className={remote === 'Azure' ? 'text-blue-600' : 'text-slate-500'} />
              <span className="font-semibold text-lg">Azure DevOps</span>
            </button>
          </div>
        </div>

        {/* Username Input */}
        <div className="space-y-3">
          <span className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Username
          </span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-0 outline-none transition-colors text-lg font-medium"
              placeholder="Enter username..."
            />
          </div>
          <p className="text-sm text-slate-500">
            This username will be used globally across CLI and Remotes.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-4 text-emerald-600 text-sm font-medium">
          <Save size={16} />
          Changes are synced to <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700">/config.json</code>
        </div>
      </div>
    </div>
  );
}
