import { Group, Panel, Separator } from 'react-resizable-panels';

/**
 * For now we accept child props for the sake of testing, but eventually this component will be responsible for rendering the browser and terminal windows itself.
 * @returns -
 */
export default function SplitView( { children }: { children?: React.ReactNode }) {

  return (
    <>
      <Group>
        <Panel minSize="40%">
          {/* Browser Window Goes Here */}
          { children }
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
