import { Terminal as XTerm } from '@xterm/xterm';
import { useEffect } from 'react';

function Terminal() {

  // Wait for DOM to be fully loaded before component mount.
  useEffect(() => {
    const terminal = new XTerm();                                 // Create new terminal instance
    terminal.open(document.getElementById('terminal-display')!);  // Mount inside div
    terminal.write('Hello, World!');                              // Test output
  }, []);

  return (
    <div id="terminal-display" className="w-full h-full" />
  );
}

export default Terminal;
