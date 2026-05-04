import { Plus, Funnel } from "lucide-react";

// This view is almost entirely redundent when indexview can handle empty states. Consider deprecating.

export default function AzureEmptyView({ openForm }: { openForm: () => void }) {

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="w-full flex-row gap-3 items-center mb-6">

        {/* Org Name / CTA Buttons */}
        <div className="flex justify-between items-center gap-4 w-full">
          {/* Organization Name - Hardcode for now as orgs are not in scope */}
          <h1 className="text-2xl font-semibold text-neutral-800">gitsim</h1>
          <button
            onClick={openForm}
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

        <div className="py-12 text-center text-gray-500">
          <div className="py-20 flex flex-col items-center text-gray-500">
            <span className="text-lg font-semibold text-gray-700">
              No match found.
            </span>
            <button className="mt-2 bg-neutral-200 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-sm text-sm">
              Reset filter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
