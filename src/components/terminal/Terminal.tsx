import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useEffect, useRef } from 'react';

function Terminal() {

  const terminalRef = useRef<HTMLDivElement>(null);               // Ref to hold the terminal instance

  // Wait for DOM to be fully loaded before component mount.
  useEffect(() => {
    const terminal = new XTerm();                                 // Create new terminal instance
    const fitAddon = new FitAddon();                              // This allows the terminal to handle dynamic resizing
    terminal.loadAddon(fitAddon);                                 // Load the fit addon into the terminal instance

    if (!terminalRef.current) return;                             // Guard against null ref
    terminal.open(terminalRef.current);                           // Open terminal in container

    fitAddon.fit();                                               // Fit terminal to container size
    terminal.write('Hello, World!');                              // Test output

    // xterm handles its own state, a persistant input buffer is fine
    let inputBuffer = "";

    // xterm has its own event system for handling user input
    terminal.onData((data) => {

      if (data.includes('\r')) {                                  // Check for Enter key (carriage return)
        terminal.write(`\r\nYou entered: ${inputBuffer.trim()}\r\n`);
        inputBuffer = "";
      } else if (data.includes('\u007F')) {                       // If backspace, slice last char
        inputBuffer = inputBuffer.slice(0, -1);
        terminal.write('\b \b');                                  // Move back, write space to erase, move back again
      } else {                                                    // For other input, just append to buffer
        inputBuffer += data;
        terminal.write(data);                                     // Echo input back to terminal
      }
    });

    // Cleanup function to dispose of terminal instance on unmount
    return () => {
      terminal.dispose();                                         // Terminal handles its own state and listeners.
    }
  }, []);

  return (
    <div ref={terminalRef} className="w-full h-full" />
  );
}

export default Terminal;
