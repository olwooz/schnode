import { useAtom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

import { bindingsAtom, selectedBindingAtom } from '@/atoms/binding';
import { ComponentBinding, BindingType, BindingConfig } from '@/types/binding';
import { BINDING_EVENT } from '@/constants/binding-event';

export function useBindings() {
  const [bindings, setBindings] = useAtom(bindingsAtom);
  const [selectedBinding, setSelectedBinding] = useAtom(selectedBindingAtom);

  function dispatchResetColumnVisibilityEvent(binding: ComponentBinding) {
    if (binding.type === BindingType.TOGGLE_COLUMN) {
      const resetEvent = new CustomEvent(BINDING_EVENT.RESET_TABLE_VISIBILITY, {
        detail: {
          id: binding.config.id,
          targetId: binding.targetId,
        },
        bubbles: true,
      });
      document.dispatchEvent(resetEvent);
    }
  }

  function dispatchResetTableFilterEvent(binding: ComponentBinding) {
    if (binding.type === BindingType.FILTER_TABLE) {
      const resetEvent = new CustomEvent(BINDING_EVENT.RESET_TABLE_FILTER, {
        detail: {
          id: binding.config.id,
          targetId: binding.targetId,
        },
        bubbles: true,
      });
      document.dispatchEvent(resetEvent);
    }
  }

  function dispatchResetTableSortEvent(binding: ComponentBinding) {
    if (binding.type === BindingType.SORT_TABLE) {
      const resetEvent = new CustomEvent(BINDING_EVENT.RESET_TABLE_SORT, {
        detail: {
          id: binding.config.id,
          targetId: binding.targetId,
        },
        bubbles: true,
      });
      document.dispatchEvent(resetEvent);
    }
  }

  function dispatchResetEventForBinding(binding: ComponentBinding) {
    if (binding.type === BindingType.TOGGLE_COLUMN) {
      dispatchResetColumnVisibilityEvent(binding);
    } else if (binding.type === BindingType.FILTER_TABLE) {
      dispatchResetTableFilterEvent(binding);
    } else if (binding.type === BindingType.SORT_TABLE) {
      dispatchResetTableSortEvent(binding);
    }
  }

  function createBinding(
    sourceId: string,
    targetId: string,
    type: BindingType,
    config: BindingConfig
  ): string {
    const newBinding: ComponentBinding = {
      id: uuidv4(),
      sourceId,
      targetId,
      type,
      config,
    };

    setBindings((prev) => [...prev, newBinding]);
    return newBinding.id;
  }

  function updateBinding(
    bindingId: string,
    updates: Partial<Omit<ComponentBinding, 'id'>>
  ): boolean {
    let found = false;

    const oldBinding = bindings.find((b) => b.id === bindingId);

    setBindings((prev) =>
      prev.map((binding) => {
        if (binding.id === bindingId) {
          found = true;
          return { ...binding, ...updates };
        }
        return binding;
      })
    );

    if (found && selectedBinding?.id === bindingId) {
      setSelectedBinding((prev) => (prev ? { ...prev, ...updates } : null));
    }

    if (found && oldBinding) {
      const targetChanged =
        updates.targetId !== undefined &&
        updates.targetId !== oldBinding.targetId;
      const configChanged =
        updates.config !== undefined &&
        updates.config.id !== oldBinding.config.id;

      if (targetChanged || configChanged) {
        dispatchResetEventForBinding(oldBinding);
      }
    }

    return found;
  }

  function deleteBinding(bindingId: string): boolean {
    const bindingToDelete = bindings.find((b) => b.id === bindingId);
    const bindingExists = bindingToDelete !== undefined;

    if (!bindingExists) {
      return false;
    }

    if (bindingToDelete) {
      dispatchResetEventForBinding(bindingToDelete);
    }

    setBindings((prev) => prev.filter((b) => b.id !== bindingId));

    if (selectedBinding?.id === bindingId) {
      setSelectedBinding(null);
    }

    return true;
  }

  function deleteBindingsForComponent(componentId: string): number {
    const bindingsToDelete = bindings.filter(
      (b) => b.sourceId === componentId || b.targetId === componentId
    );

    if (bindingsToDelete.length === 0) {
      return 0;
    }

    bindingsToDelete.forEach((binding) => {
      dispatchResetEventForBinding(binding);
    });

    setBindings((prev) =>
      prev.filter(
        (b) => b.sourceId !== componentId && b.targetId !== componentId
      )
    );

    if (
      selectedBinding &&
      (selectedBinding.sourceId === componentId ||
        selectedBinding.targetId === componentId)
    ) {
      setSelectedBinding(null);
    }

    return bindingsToDelete.length;
  }

  function selectBinding(bindingId: string | null) {
    if (bindingId === null) {
      setSelectedBinding(null);
      return true;
    }

    const binding = bindings.find((b) => b.id === bindingId);
    if (!binding) {
      return false;
    }

    setSelectedBinding(binding);
    return true;
  }

  function getBinding(bindingId: string): ComponentBinding | undefined {
    return bindings.find((b) => b.id === bindingId);
  }

  function getBindingsForComponent(componentId: string): ComponentBinding[] {
    return bindings.filter(
      (b) => b.sourceId === componentId || b.targetId === componentId
    );
  }

  function getBindingsByType(type: BindingType): ComponentBinding[] {
    return bindings.filter((b) => b.type === type);
  }

  function hasBindings(sourceId: string, targetId?: string): boolean {
    if (!targetId) {
      return false;
    }

    return bindings.some(
      (b) =>
        [b.sourceId, b.targetId].includes(sourceId) &&
        [b.sourceId, b.targetId].includes(targetId)
    );
  }

  return {
    bindings,
    selectedBinding,
    createBinding,
    updateBinding,
    deleteBinding,
    deleteBindingsForComponent,
    selectBinding,
    getBinding,
    getBindingsForComponent,
    getBindingsByType,
    hasBindings,
  };
}
