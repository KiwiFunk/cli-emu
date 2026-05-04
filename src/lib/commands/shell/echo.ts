import fs from "@/lib/fileSystem";
import type { CommandContext } from "@/types";
import { resolvePath } from "../helpers";
import { useAppStore } from "@/store/useAppStore";

/**
 * Echoes text to the terminal, or writes it to a file if redirected with > or >>
 */
export async function echo(ctx: CommandContext): Promise<string> {
  const { args } = ctx;

  // Check for redirection operator (> for overwrite, >> for append) Returns -1 if not found
  const redirectIndex = args.findIndex((arg) => arg === ">" || arg === ">>");

  if (redirectIndex !== -1) {
    // text args / operator / file
    const isAppend = args[redirectIndex] === ">>";
    const textArgs = args.slice(0, redirectIndex);
    const fileArg = args[redirectIndex + 1];

    if (!fileArg) return "bash: syntax error near unexpected token `newline'";

    const textToEcho = textArgs.join(" ") + "\n";
    const path = resolvePath(fileArg);

    try {
      if (isAppend) {
        // Read the existing file (if it exists) to safely append to it
        let existingContent = "";
        try {
          existingContent = await fs.promises.readFile(path, "utf8");
        } catch (err) {
          // If the file doesn't exist start with an empty string
        }
        const newContent = existingContent + textToEcho;
        await fs.promises.writeFile(path, newContent, "utf8");
      } else {
        await fs.promises.writeFile(path, textToEcho, "utf8");
      }

      // Replace with a proper listener in the future.
      if (path === "/config.json") {
        await useAppStore.getState().loadConfig();
      }

      return ""; // Redirection produces no terminal output
    } catch (err: unknown) {
      return `bash: ${fileArg}: Permission denied or invalid path`;
    }
  }

  // If no redirection, print direct to terminal
  return args.join(" ");
}
