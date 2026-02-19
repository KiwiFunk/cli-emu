// Shell commands (ls, cd, mkdir, touch, cat, echo etc.)

/**
  * Lists the contents of a directory.
  * @param path - The path to the directory to list. If not provided, lists the current directory.
  * @returns - An array of file and directory names in the specified directory.
  */
export function ls(path: string = ".") {
  // For now, we'll just return a static list of files and directories for demonstration purposes.
  return "file1.txt file2.txt dir1 dir2";
}

// Future commands to implement:
// cd(path: string): void
// mkdir(path: string): void
// touch(path: string): void
// cat(path: string): string
// echo(text: string): void
