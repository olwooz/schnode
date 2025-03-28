import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { componentsAtom, selectedComponentAtom } from '@/atoms/component';
import { CanvasComponent, CanvasPosition } from '@/types/dnd';
import { isPreviewModeAtom } from '@/atoms/mode';

export type UpdateComponentProps = {
  id?: string;
  key: string;
  value: string;
};

export const useComponentActions = () => {
  const isPreviewMode = useAtomValue(isPreviewModeAtom);
  const [components, setComponents] = useAtom(componentsAtom);
  const setSelectedComponent = useSetAtom(selectedComponentAtom);

  function handleAddComponent(component: CanvasComponent) {
    setComponents((prev) => [...prev, component]);
    setSelectedComponent(component);
  }

  function handleSelectComponent(id: string | null) {
    if (isPreviewMode) {
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
  }

  return {
    handleAddComponent,
    handleSelectComponent,
    handleUpdateComponent,
    handleRepositionComponent,
    handleDeleteComponent,
  };
};
