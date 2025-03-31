import { useAtomValue } from 'jotai';

import { isPreviewModeAtom } from '@/atoms/mode';
import {
  Dock,
  DockLabel,
  DockItem,
  DockIcon,
} from '@/components/motion-primitives/dock';

import { Export } from './Export';
import { Import } from './Import';
import { PreviewToggle } from './PreviewToggle';
import { ThemeToggle } from './ThemeToggle';

export function AppDock() {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);

  const dockItems = [
    {
      title: 'Import',
      icon: <Import />,
    },
    {
      title: 'Export',
      icon: <Export />,
    },
    {
      title: isPreviewMode ? 'Edit' : 'Preview',
      icon: <PreviewToggle />,
    },
    {
      title: 'Theme',
      icon: <ThemeToggle />,
    },
  ];

  return (
    <div className='absolute bottom-2 left-1/2 max-w-full -translate-x-1/2'>
      <Dock className='items-end pb-3'>
        {dockItems.map((item) => (
          <DockItem
            key={item.title}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800'
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
