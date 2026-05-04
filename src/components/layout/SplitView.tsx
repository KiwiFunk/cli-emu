import { Group, Panel, Separator } from 'react-resizable-panels';

import Terminal from '@/components/terminal/Terminal';
import BrowserFrame from '../browser/BrowserFrame';
import { BrowserTab } from '../browser/BrowserFrame';
import Challenges from '../browser/Challenges';
import RemoteRouter from '../browser/providers/RemoteRouter' // For Remote
import Glossary from '../browser/Glossary';
import Settings from '../browser/Settings';

import { useAppStore } from '@/store/useAppStore';

const panelStyles = "bg-slate-800 rounded-md shadow-md overflow-hidden";

interface SplitViewProps {
  className?: string;
}

function SplitView({ className }: SplitViewProps) {

  const remoteName = useAppStore(state => state.remote)

  return (
    <>
      <Group className={`${className} w-full h-full flex`}>
        {/* In TSX, we need to wrap the template literal in {} to say 'hey, switch to javascript mode!' */}
        <Panel minSize="40%" className={`${panelStyles}`}>
          {/* Browser Window Goes Here */}
          <BrowserFrame>
            <BrowserTab tabTitle="Intro | Challenges">
              <Challenges />
            </BrowserTab>
            <BrowserTab tabTitle={remoteName}>
              <RemoteRouter />
            </BrowserTab>
            <BrowserTab tabTitle="Glossary">
              <Glossary />
            </BrowserTab>
            <BrowserTab tabTitle="Settings">
              <Settings />
            </BrowserTab>
          </BrowserFrame>
        </Panel>

        <Separator
          className="
          w-2
          outline-none
          rounded-sm
          mx-1
          bg-slate-600
          data-[separator='hover']:bg-slate-500
          data-[separator='active']:bg-slate-400
          "
        />

        <Panel className={`${panelStyles}`} minSize="20%">
          <Terminal />
        </Panel>
      </Group>
    </>
  );
}

export default SplitView;
