import { Group, Panel, Separator } from 'react-resizable-panels';

export default function SplitView() {

  return (
    <>
      <Group>
        <Panel minSize="40%">
          {/* Browser Window Goes Here */}
          left
        </Panel>
        <Separator />
        <Panel>
          {/* Terminal Window Goes Here */}
          right
        </Panel>
      </Group>
    </>
  );
}
