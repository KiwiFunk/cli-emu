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
