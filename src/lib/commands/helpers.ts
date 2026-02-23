import { useTerminalStore } from "../../store/useTerminalStore.ts";

/**
 * Helper to resolve relative or absolute paths against the CWD
 */
export const resolvePath = (input: string): string => {
  const cwd = useTerminalStore.getState().cwd;

  if (input == ".") return cwd;

  const combined = input.startsWith('/') ? input : `${cwd}/${input}`;
  // Normalize: remove double slashes and trailing slashes (except root)
  let normalized = combined.replace(/\/+/g, '/');
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || '/';
};
