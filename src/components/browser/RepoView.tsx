import { Book, Folder, FileText, ChevronDown, Plus, Play, Shield, Code, Settings, Star, GitFork, Eye } from 'lucide-react';

interface GithubRepoProps {
  hasRepo: boolean;
}

const GithubRepo = ({ hasRepo }: GithubRepoProps) => {
  if (!hasRepo) return <EmptyState />;

  return (
    <div className="bg-[#0d1117] min-h-full text-[#c9d1d9] font-sans p-4 md:p-8">
      {/* Repo Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xl">
          <Book size={18} className="text-[#8b949e]" />
          <span className="text-[#58a6ff] hover:underline cursor-pointer">username</span>
          <span className="text-[#8b949e]">/</span>
          <span className="font-semibold text-[#58a6ff] hover:underline cursor-pointer">new-cool-project</span>
          <span className="px-2 py-0.5 text-xs border border-[#30363d] rounded-full text-[#8b949e]">Public</span>
        </div>

        <div className="flex gap-2">
          <RepoActionButton icon={<Eye size={16} />} label="Watch" count="1" />
          <RepoActionButton icon={<GitFork size={16} />} label="Fork" count="0" />
          <RepoActionButton icon={<Star size={16} />} label="Star" count="12" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#30363d] mb-4 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-[#f78166] text-[#f0f6fc]">
          <Code size={16} /> Code
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-[#8b949e] hover:text-[#f0f6fc] cursor-pointer">
          <Play size={16} /> Actions
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-[#8b949e] hover:text-[#f0f6fc] cursor-pointer">
          <Settings size={16} /> Settings
        </div>
      </div>

      {/* File List Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 bg-[#21262d] px-3 py-1.5 rounded-md border border-[#30363d] text-sm font-medium hover:bg-[#30363d] cursor-pointer">
          <GitFork size={14} /> main <ChevronDown size={14} />
        </div>
        <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2">
          <Code size={14} /> Code <ChevronDown size={14} />
        </button>
      </div>

      {/* Mock File Explorer */}
      <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117]">
        <div className="bg-[#161b22] p-4 border-b border-[#30363d] flex justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">JD</div>
            <span className="font-semibold">Name Here</span>
            <span className="text-[#8b949e]">Initial commit</span>
          </div>
          <span className="text-[#8b949e]">2 hours ago</span>
        </div>

        <FileRow icon={<Folder className="text-[#7d8590]" />} name="src" message="Add core logic" time="2h" />
        <FileRow icon={<Folder className="text-[#7d8590]" />} name="public" message="Assets" time="5h" />
        <FileRow icon={<FileText className="text-[#7d8590]" />} name="package.json" message="Init dependencies" time="2h" />
        <FileRow icon={<FileText className="text-[#7d8590]" />} name="README.md" message="Update documentation" time="1h" />
      </div>
    </div>
  );
};

// Sub Components

const EmptyState = () => (
  <div className="bg-[#0d1117] min-h-full text-[#c9d1d9] p-8 font-sans">
    <div className="max-w-3xl mx-auto border border-[#30363d] rounded-md p-8 bg-[#161b22]">
      <h2 className="text-xl font-semibold mb-4 text-[#f0f6fc]">Quick setup — if you’ve done this kind of thing before</h2>
      <div className="bg-[#0d1117] p-4 rounded-md border border-[#30363d] mb-6 font-mono text-sm leading-relaxed">
        <p><span className="text-[#ff7b72]">git remote add</span> origin https://github.com/user/repo.git</p>
        <p><span className="text-[#ff7b72]">git branch</span> -M main</p>
        <p><span className="text-[#ff7b72]">git push</span> -u origin main</p>
      </div>
      <h3 className="font-semibold mb-2">...or create a new repository on the command line</h3>
      <div className="bg-[#0d1117] p-4 rounded-md border border-[#30363d] font-mono text-sm leading-relaxed">
        <p className="text-[#8b949e]"># echo "# new-project" &gt; README.md</p>
        <p>git init</p>
        <p>git add README.md</p>
        <p>git commit -m "first commit"</p>
      </div>
    </div>
  </div>
);

const FileRow = ({ icon, name, message, time }: any) => (
  <div className="flex items-center justify-between p-3 border-b border-[#30363d] hover:bg-[#161b22] text-sm transition-colors cursor-pointer">
    <div className="flex items-center gap-3 w-1/3">
      {icon} <span className="hover:text-[#58a6ff] hover:underline">{name}</span>
    </div>
    <div className="text-[#8b949e] flex-1 truncate">{message}</div>
    <div className="text-[#8b949e] text-right">{time} ago</div>
  </div>
);

const RepoActionButton = ({ icon, label, count }: any) => (
  <div className="flex items-center border border-[#30363d] rounded-md overflow-hidden text-xs font-semibold">
    <button className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] px-3 py-1 border-r border-[#30363d]">
      {icon} {label}
    </button>
    <span className="bg-[#161b22] px-3 py-1">{count}</span>
  </div>
);

export default GithubRepo;
