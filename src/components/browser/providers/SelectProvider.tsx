import { useAppStore } from '@/store/useAppStore';

export default function SelectProvider() {
  const setRemote = useAppStore(state => state.setRemote);

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Select Remote Provider</div>

      <div className="flex flex-row gap-4">
        <button
          onClick={() => setRemote('github')}
          className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900 transition-colors"
        >
          GitHub
        </button>

        <button
          onClick={() => setRemote('azure')}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors"
        >
          Azure DevOps (ADO)
        </button>
      </div>
    </div>
  );
}
