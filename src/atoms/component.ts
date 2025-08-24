import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { CanvasComponent } from '@/types/dnd';

export const componentIdsAtom = atom<string[]>([]);
export const componentAtomFamily = atomFamily(() => 
  atom<CanvasComponent | null>(null)
);
export const selectedComponentIdAtom = atom<string | null>(null);

export const allComponentsAtom = atom((get) => {
  const componentIds = get(componentIdsAtom);
  const components: CanvasComponent[] = [];
  
  for (const id of componentIds) {
    const component = get(componentAtomFamily(id));
    if (component) {
      components.push(component);
    }
  }
  
  return components;
});

export const selectedComponentAtom = atom((get) => {
  const selectedId = get(selectedComponentIdAtom);
  if (!selectedId) return null;
  
  return get(componentAtomFamily(selectedId));
});

export const componentsAtom = atom(
  (get) => get(allComponentsAtom),
  (get, set, newComponents: CanvasComponent[]) => {
    const currentIds = get(componentIdsAtom);
    
    currentIds.forEach(id => {
      set(componentAtomFamily(id), null);
    });
    
    const newIds = newComponents.map(component => component.id);
    set(componentIdsAtom, newIds);
    
    newComponents.forEach(component => {
      set(componentAtomFamily(component.id), component);
    });
  }
);

export const createComponentAtom = atom(
  null,
  (get, set, component: CanvasComponent) => {
    const currentIds = get(componentIdsAtom);
    set(componentIdsAtom, [...currentIds, component.id]);
    set(componentAtomFamily(component.id), component);
    
    return component.id;
  }
);

export const updateComponentAtom = atom(
  null,
  (get, set, args: { id: string; updates: Partial<Omit<CanvasComponent, 'id'>> }) => {
    const { id, updates } = args;
    const currentComponent = get(componentAtomFamily(id));
    
    if (!currentComponent) return false;
    
    const updatedComponent = { ...currentComponent, ...updates };
    set(componentAtomFamily(id), updatedComponent);
    
    return true;
  }
);

export const deleteComponentAtom = atom(
  null,
  (get, set, componentId: string) => {
    const currentIds = get(componentIdsAtom);
    const componentExists = currentIds.includes(componentId);
    
    if (!componentExists) return false;
    
    set(componentIdsAtom, currentIds.filter(id => id !== componentId));
    set(componentAtomFamily(componentId), null);
    
    const selectedId = get(selectedComponentIdAtom);
    if (selectedId === componentId) {
      set(selectedComponentIdAtom, null);
    }
    
    return true;
  }
);

export function useComponentAtomActions() {
  return {
    createComponentAction: useSetAtom(createComponentAtom),
    updateComponentAction: useSetAtom(updateComponentAtom),
    deleteComponentAction: useSetAtom(deleteComponentAtom),
    setSelectedComponentId: useSetAtom(selectedComponentIdAtom),
  };
}
