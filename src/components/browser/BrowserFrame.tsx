// Containter that emulates a browser window, with a title bar and a content area for the webview.
// Accept child components to be rendered in the content area.

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>
        {/* Tabs Bar */}
        <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-t-md">

        </div>
        {/* Address Bar */}
        <div>

        </div>
      </div>

      {/* Content Area */}
      <div>
        {children}
      </div>
    </>
  );
}

export default BrowserFrame;
