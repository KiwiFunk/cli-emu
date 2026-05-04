import fs from '@/lib/fileSystem';
import type { CommandContext } from '@/types';
import { resolvePath, isFsError } from '@/lib/commands/helpers.ts';

/**
 * Read content of one or more files and print to console.
 * @param ctx - Context Obj from dispatcher with args
 */
 export async function cat(ctx: CommandContext): Promise<string> {
   const { args } = ctx;

   if (args.length === 0) {
     return "cat: missing file operand";
   }

   const results = await Promise.all(
     args.map(async (arg) => {
       const path = resolvePath(arg);
       try {
         // Read the file as utf8 text
         const content = await fs.promises.readFile(path, 'utf8');
         return content;
       } catch (error: unknown) {
         // check lightning-fs docs for error codes
         if (isFsError(error) && error.code === 'ENOENT') {
           return `cat: ${arg}: No such file or directory`;
         }
         if (isFsError(error) && error.code === 'EISDIR') {
           return `cat: ${arg}: Is a directory`;
         }
         return `cat: ${arg}: Permission denied`;
       }
     })
   );

   // Join the outputs together (if multiple files at once)
   return results.join('\r\n');
 }
