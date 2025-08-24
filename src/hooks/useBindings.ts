import { useAtomValue } from 'jotai';

import {
  selectedBindingAtom,
  allBindingsAtom,
  useBindingAtomActions,
} from '@/atoms/binding';
import { BINDING_EVENT } from '@/constants/binding-event';
import { ComponentBinding, BindingType, BindingConfig } from '@/types/binding';

export function useBindings() {
  const bindings = useAtomValue(allBindingsAtom);
  const selectedBinding = useAtomValue(selectedBindingAtom);
  const {
    createBindingAction,
    updateBindingAction,
    deleteBindingAction,
    deleteBindingsForComponentAction,
    setSelectedBindingId,
  } = useBindingAtomActions();

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
    return createBindingAction({ sourceId, targetId, type, config });
  }

  function updateBinding(
    bindingId: string,
    updates: Partial<Omit<ComponentBinding, 'id'>>
  ): boolean {
    const oldBinding = bindings.find((b) => b.id === bindingId);
    const result = updateBindingAction({ id: bindingId, updates });

    if (result && oldBinding) {
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

    return result;
  }

  function deleteBinding(bindingId: string): boolean {
    const bindingToDelete = bindings.find((b) => b.id === bindingId);

    if (!bindingToDelete) {
      return false;
    }

    dispatchResetEventForBinding(bindingToDelete);
    return deleteBindingAction(bindingId);
  }

  function deleteBindingsForComponent(componentId: string): number {
    const bindingsToDelete = deleteBindingsForComponentAction(componentId);

    bindingsToDelete.forEach((binding) => {
      dispatchResetEventForBinding(binding);
    });

    return bindingsToDelete.length;
  }

  function selectBinding(bindingId: string | null) {
    setSelectedBindingId(bindingId);
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
