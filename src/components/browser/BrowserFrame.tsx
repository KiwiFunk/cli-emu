// Containter that emulates a browser window, with a title bar and a content area for the webview.
// Accept child components to be rendered in the content area.

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-md shadow-md w-full h-full flex flex-col">
      <div className="bg-gray-200 p-2 rounded-t-md">
        <span className="text-sm font-semibold">Browser Title</span>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default BrowserFrame;
