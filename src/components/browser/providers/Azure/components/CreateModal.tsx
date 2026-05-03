import { useState } from "react";
import { X, Globe, Lock, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import type { CreateRepoFormProps } from "@/types";

export default function AzureCreateModal({ onSubmit, isPending, error, onClose }: CreateRepoFormProps) {
  const [repoName, setRepoName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("private");  // We don't actually use this for now
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [addReadme, setAddReadme] = useState(true);

  return (
    // Backdrop Overlay
    <div className="absolute inset-0 bg-black/20 z-50 flex justify-end font-sans text-[14px] text-neutral-600">

      {/* Modal */}
      <div className="absolute m-2 w-full max-w-[500px] bg-white h-[98%] rounded-md shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <h2 className="text-xl font-semibold text-neutral-800">Create new project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors p-1"
          >
            <X size={20} className="stroke-[1.5]" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("repoName") as string;
            const addReadme = formData.get("addReadme") === "on";
            onSubmit(name, addReadme);
          }}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

            {/* Project Name */}
            <div>
              <label className="block text-gray-700 mb-1">
                Project name <span className="text-[#A80000]">*</span>
              </label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                autoFocus
                className="w-full border border-gray-400 hover:border-gray-500 focus:border-sky-600 focus:ring-1 focus:ring-[#0078D4] px-2 py-1.5 outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full border border-gray-400 hover:border-gray-500 focus:border-sky-600 focus:ring-1 focus:ring-[#0078D4] px-2 py-1.5 outline-none transition-colors resize-none"
              />
            </div>

            {/* Visibility - Does nothing for now */}
            <div>
              <label className="block text-gray-700 mb-2">Visibility</label>
              <div className="grid grid-cols-2 gap-4">

                {/* Public */}
                <div
                  onClick={() => setVisibility("public")}
                  className={`bg-neutral-100 border-2 p-4 cursor-pointer relative ${
                    visibility === "public" ? "border-sky-600" : "border-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={18} className="text-neutral-600" />
                    <span className="font-semibold text-neutral-900">Public</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    Anyone on the internet can view the project. Certain features like TFVC are not supported.
                  </p>
                  {visibility === "public" && (
                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-[5px] border-sky-600" />
                  )}
                </div>

                {/* Private */}
                <div
                  onClick={() => setVisibility("private")}
                  className={`bg-neutral-100 border-2 p-4 cursor-pointer relative ${
                    visibility === "private" ? "border-sky-600" : "border-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={18} className="text-neutral-600" />
                    <span className="font-semibold text-neutral-900">Private</span>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">
                    Only people you give access to will be able to view this project.
                  </p>
                  {visibility === "private" && (
                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full border-[5px] border-sky-600" />
                  )}
                </div>

              </div>
            </div>

            {/* Advanced Settings */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex justify-center items-center gap-2 w-full text-neutral-700 hover:text-neutral-900 bg-neutral-100 p-2 cursor-pointer"
              >
                {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="font-semibold">Advanced</span>
              </button>

              {advancedOpen && (
                <div className="grid grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="flex items-center gap-1 text-neutral-700 mb-1">
                      Version control <HelpCircle size={14} className="text-sky-600" />
                    </label>
                    <div className="relative">
                      <select className="w-full border border-neutral-400 px-2 py-1.5 outline-none appearance-none bg-transparent">
                        <option>Git</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-2 top-2 text-neutral-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-neutral-700 mb-1">
                      Work item process <HelpCircle size={14} className="text-sky-600" />
                    </label>
                    <div className="relative">
                      <select className="w-full border border-gray-400 px-2 py-1.5 outline-none appearance-none bg-transparent">
                        <option>Basic</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-2 top-2 text-neutral-600 pointer-events-none" />
                    </div>
                  </div>

                  {/* Type expects an 'addReadme' option */}
                  <div className="col-span-2 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addReadme}
                        onChange={(e) => setAddReadme(e.target.checked)}
                        className="w-4 h-4 accent-sky-600"
                      />
                      <span>Initialize with a README</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Error toast */}
            {error && (
              <div className="p-3 bg-red-50 text-[#A80000] border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !repoName.trim()}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:bg-neutral-100 disabled:text-neutral-300 text-white font-semibold transition-colors cursor-pointer disabled:cursor-default"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
