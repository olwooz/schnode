import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { componentsAtom, selectedComponentAtom } from '@/atoms/component';
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
  const [components, setComponents] = useAtom(componentsAtom);
  const setSelectedComponent = useSetAtom(selectedComponentAtom);
  const { deleteBindingsForComponent } = useBindings();

  function handleAddComponent(component: CanvasComponent) {
    setComponents((prev) => [...prev, component]);
    setSelectedComponent(component);
  }

  function handleSelectComponent(id: string | null) {
    if (isPreviewMode) {
      return;
    }

    if (id === null) {
      setSelectedComponent(null);
      return;
    }

    const component = components.find((component) => component.id === id);

    if (!component) {
      return;
    }

    setSelectedComponent(component);
  }

  function handleUpdateComponent({ id, key, value }: UpdateComponentProps) {
    if (!id) {
      return;
    }

    setComponents(
      components.map((component) => {
        if (component.id === id) {
          component.props[key] = value;
        }
        return component;
      })
    );
  }

  function handleRepositionComponent(id: string, position: CanvasPosition) {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id ? { ...component, position } : component
      )
    );
  }

  function handleDeleteComponent(id: string) {
    setComponents((prev) => prev.filter((component) => component.id !== id));
    deleteBindingsForComponent(id);
    setSelectedComponent((prev) => (prev?.id === id ? null : prev));
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
