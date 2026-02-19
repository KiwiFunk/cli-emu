import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useEffect } from 'react';

function Terminal() {

  // Wait for DOM to be fully loaded before component mount.
  useEffect(() => {
    const terminal = new XTerm();                                 // Create new terminal instance
    const fitAddon = new FitAddon();                              // This allows the terminal to handle dynamic resizing

    terminal.open(document.getElementById('terminal-display')!);  // Open terminal in the div container
    fitAddon.fit();                                               // Fit terminal to container size
    terminal.write('Hello, World!');                              // Test output
  }, []);

  return (
    <div id="terminal-display" className="w-full h-full" />
  );
}

export default Terminal;
