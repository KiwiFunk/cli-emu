import { Group, Panel, Separator } from 'react-resizable-panels';

/**
 * For now we accept child props for the sake of testing, but eventually this component will be responsible for rendering the browser and terminal windows itself.
 * @returns -
 */
export default function SplitView() {

  return (
    <>
      <Group className='w-full h-screen flex'>
        <Panel minSize="40%" className='bg-gray-400'>
          {/* Browser Window Goes Here */}
            left
        </Panel>
        <Separator />
        <Panel className='bg-gray-600' minSize="20%">
          {/* Terminal Window Goes Here */}
          right
        </Panel>
      </Group>
    </>
  );
}
