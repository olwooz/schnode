import { atom } from 'jotai';

import { BindingsState, ComponentBinding, BindingType } from '@/types/binding';

export const bindingsAtom = atom<BindingsState>([]);
export const selectedBindingAtom = atom<ComponentBinding | null>(null);

export const bindingsByComponentAtom = atom((get) => (componentId: string) => {
  const bindings = get(bindingsAtom);
  return bindings.filter(
    (binding) =>
      binding.sourceId === componentId || binding.targetId === componentId
  );
});

export const bindingsByTypeAtom = atom((get) => (type: BindingType) => {
  const bindings = get(bindingsAtom);
  return bindings.filter((binding) => binding.type === type);
});

export const hasBindingsAtom = atom((get) => (componentId: string) => {
  const getBindingsByComponent = get(bindingsByComponentAtom);
  return getBindingsByComponent(componentId).length > 0;
});
