import type { SkinLayoutProps } from "@/types";

export default function GitHubLayout({ children }: SkinLayoutProps) {
  return (
    <div className="github-skin-root bg-[#0d1117] min-h-screen">
      {/* TODO: Top Navigation Bar */}
      {children}
    </div>
  );
}
