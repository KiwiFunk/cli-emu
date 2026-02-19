##  Technologies

### `react-resizable-panels`
This library provides a simple way to create resizable panels in React. It will allow us to create a split view with a terminal on one side and a web view on the other, where users can adjust the size of each panel by dragging the divider.
You can think of it as an extention of a basic html table layout, but with the added functionality of being able to resize the panels by dragging the divider.
```jsx
<PanelGroup direction="horizontal">
  <Panel>          {/* Left: Web View */}
    ...
  </Panel>

  <PanelResizeHandle />

  <Panel>          {/* Right: Terminal */}
    ...
  </Panel>
</PanelGroup>
```

### `lightning-fs`
This is a virtual file system optimized for use with `isomorphic-git`. It allows us to create an in-memory file system that behaves like a real one, which is crucial for running git commands in the browser. It supports standard file operations like reading, writing, and listing files, and it integrates seamlessly with `isomorphic-git` to allow us to perform git operations on the virtual file system. It makes use of the browser's IndexedDB for persistent storage, so we dont have to worry about issues with in-memory storage, such as limits, or data loss on page refresh. 

To make use of `isomorphic-git` we also need a proper file system, as it wouldn't simply accept a more basic JavaScript object, `lightning-fs` provides the necessary API and structure.

### `isomorphic-git`
This is a pure JavaScript implementation of git that can run in the browser. It allows us to execute git commands against our virtual file system, enabling us to simulate a git workflow entirely in the browser. It supports a wide range of git commands, including `git init`, `git add`, `git commit`, and more. It also provides a way to read the git log and file tree, which we can use to render the "GitHub" view in our application.
