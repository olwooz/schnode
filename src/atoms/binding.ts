import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { v4 as uuidv4 } from 'uuid';

import { ComponentBinding, BindingType, BindingConfig } from '@/types/binding';

export const bindingIdsAtom = atom<string[]>([]);
export const bindingAtomFamily = atomFamily(() => 
  atom<ComponentBinding | null>(null)
);
export const selectedBindingIdAtom = atom<string | null>(null);

export const allBindingsAtom = atom((get) => {
  const bindingIds = get(bindingIdsAtom);
  const bindings: ComponentBinding[] = [];
  
  for (const id of bindingIds) {
    const binding = get(bindingAtomFamily(id));
    if (binding) {
      bindings.push(binding);
    }
  }
  
  return bindings;
});

export const selectedBindingAtom = atom((get) => {
  const selectedId = get(selectedBindingIdAtom);
  if (!selectedId) return null;
  
  return get(bindingAtomFamily(selectedId));
});

export const bindingsAtom = atom(
  (get) => get(allBindingsAtom),
  (get, set, newBindings: ComponentBinding[]) => {
    const currentIds = get(bindingIdsAtom);
    
    currentIds.forEach(id => {
      set(bindingAtomFamily(id), null);
    });
    
    const newIds = newBindings.map(binding => binding.id);
    set(bindingIdsAtom, newIds);
    
    newBindings.forEach(binding => {
      set(bindingAtomFamily(binding.id), binding);
    });
  }
);

export const createBindingAtom = atom(
  null,
  (get, set, args: { sourceId: string; targetId: string; type: BindingType; config: BindingConfig }) => {
    const { sourceId, targetId, type, config } = args;
    const newBinding: ComponentBinding = {
      id: uuidv4(),
      sourceId,
      targetId,
      type,
      config,
    };

    const currentIds = get(bindingIdsAtom);
    set(bindingIdsAtom, [...currentIds, newBinding.id]);
    set(bindingAtomFamily(newBinding.id), newBinding);
    
    return newBinding.id;
  }
);

export const updateBindingAtom = atom(
  null,
  (get, set, args: { id: string; updates: Partial<Omit<ComponentBinding, 'id'>> }) => {
    const { id, updates } = args;
    const currentBinding = get(bindingAtomFamily(id));
    
    if (!currentBinding) return false;
    
    const updatedBinding = { ...currentBinding, ...updates };
    set(bindingAtomFamily(id), updatedBinding);
    
    return true;
  }
);

export const deleteBindingAtom = atom(
  null,
  (get, set, bindingId: string) => {
    const currentIds = get(bindingIdsAtom);
    const bindingExists = currentIds.includes(bindingId);
    
    if (!bindingExists) return false;
    
    set(bindingIdsAtom, currentIds.filter(id => id !== bindingId));
    set(bindingAtomFamily(bindingId), null);
    
    const selectedId = get(selectedBindingIdAtom);
    if (selectedId === bindingId) {
      set(selectedBindingIdAtom, null);
    }
    
    return true;
  }
);

export const deleteBindingsForComponentAtom = atom(
  null,
  (get, set, componentId: string): ComponentBinding[] => {
    const allBindings = get(allBindingsAtom);
    const bindingsToDelete = allBindings.filter(
      (b) => b.sourceId === componentId || b.targetId === componentId
    );
    
    if (bindingsToDelete.length === 0) return [];
    
    const currentIds = get(bindingIdsAtom);
    const idsToDelete = bindingsToDelete.map(b => b.id);
    
    set(bindingIdsAtom, currentIds.filter(id => !idsToDelete.includes(id)));
    
    idsToDelete.forEach(id => {
      set(bindingAtomFamily(id), null);
    });
    
    const selectedId = get(selectedBindingIdAtom);
    if (selectedId && idsToDelete.includes(selectedId)) {
      set(selectedBindingIdAtom, null);
    }
    
    return bindingsToDelete;
  }
);

export function useBindingAtomActions() {
  return {
    createBindingAction: useSetAtom(createBindingAtom),
    updateBindingAction: useSetAtom(updateBindingAtom),
    deleteBindingAction: useSetAtom(deleteBindingAtom),
    deleteBindingsForComponentAction: useSetAtom(deleteBindingsForComponentAtom),
    setSelectedBindingId: useSetAtom(selectedBindingIdAtom),
  };
}
