import { useCallback, memo, useMemo } from 'react';

import { useAtomValue } from 'jotai';

import { componentsAtom } from '@/atoms/component';
import ComponentRenderer from '@/components/renderer/ComponentRenderer';
import { CanvasComponent, DropPreview } from '@/types/dnd';

function DropPreviewComponent({
  previewRef,
  dropPreview,
}: {
  previewRef: React.RefObject<HTMLDivElement | null>;
  dropPreview: DropPreview;
}) {
  const components = useAtomValue(componentsAtom);

  const getComponentProps = useCallback(
    (componentId: string) => {
      const component = components.find(
        (comp: CanvasComponent) => comp.id === componentId
      );
      return component?.props || {};
    },
    [components]
  );

  const componentProps = useMemo(() => {
    if (dropPreview.isRelocation && dropPreview.id) {
      return getComponentProps(dropPreview.id);
    }
    return {};
  }, [dropPreview.isRelocation, dropPreview.id, getComponentProps]);

  return (
    <div
      ref={previewRef}
      className='absolute rounded border-2 border-dashed border-blue-500 bg-blue-100 p-2 z-10 pointer-events-none opacity-80'
      style={{
        left: `${dropPreview.position.x}px`,
        top: `${dropPreview.position.y}px`,
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        maxWidth: 'calc(100% - 2rem)',
      }}
    >
      {dropPreview.previewComponentType && (
        <ComponentRenderer
          type={dropPreview.previewComponentType}
          props={componentProps}
        />
      )}
    </div>
  );
}

export default memo(DropPreviewComponent);
