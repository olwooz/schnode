import { useAtomValue } from 'jotai';

import { componentsAtom, useComponentAtomActions } from '@/atoms/component';
import { isPreviewModeAtom } from '@/atoms/mode';
import { useBindings } from '@/hooks/useBindings';
import { CanvasComponent, CanvasPosition } from '@/types/dnd';

export type UpdateComponentProps = {
  id?: string;
  key: string;
  value: string;
};

export function useComponentActions() {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const components = useAtomValue(componentsAtom);
  const {
    createComponentAction,
    updateComponentAction,
    deleteComponentAction,
    setSelectedComponentId,
  } = useComponentAtomActions();
  const { deleteBindingsForComponent } = useBindings();

  function handleAddComponent(component: CanvasComponent) {
    createComponentAction(component);
    setSelectedComponentId(component.id);
  }

  function handleSelectComponent(id: string | null) {
    if (isPreviewMode) {
      return;
    }

    setSelectedComponentId(id);
  }

  function handleUpdateComponent({ id, key, value }: UpdateComponentProps) {
    if (!id) {
      return;
    }

    updateComponentAction({
      id,
      updates: {
        props: {
          ...components.find((c) => c.id === id)?.props,
          [key]: value,
        },
      },
    });
  }

  function handleRepositionComponent(id: string, position: CanvasPosition) {
    updateComponentAction({ id, updates: { position } });
  }

  function handleDeleteComponent(id: string) {
    deleteBindingsForComponent(id);
    deleteComponentAction(id);
  }

  function getComponentById(id: string): CanvasComponent | undefined {
    return components.find((component) => component.id === id);
  }

  function getComponentsByType(type: string): CanvasComponent[] {
    return components.filter((component) => component.type === type);
  }

  return {
    components,
    handleAddComponent,
    handleSelectComponent,
    handleUpdateComponent,
    handleRepositionComponent,
    handleDeleteComponent,
    getComponentById,
    getComponentsByType,
  };
}
