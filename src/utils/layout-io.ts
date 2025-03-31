import { CanvasComponent } from '@/types/dnd';
import { ComponentBinding } from '@/types/binding';

interface LayoutData {
  components: CanvasComponent[];
  bindings: ComponentBinding[];
}

export function serializeLayout(
  components: CanvasComponent[],
  bindings: ComponentBinding[] = []
): string {
  const layoutData: LayoutData = {
    components,
    bindings,
  };
  return JSON.stringify(layoutData, null, 2);
}

export function deserializeLayout(json: string): LayoutData {
  try {
    const parsed = JSON.parse(json);

    if (
      typeof parsed !== 'object' ||
      !parsed ||
      (!('components' in parsed) && !Array.isArray(parsed))
    ) {
      throw new Error('Invalid layout format');
    }

    if (!Array.isArray(parsed.components)) {
      throw new Error('Invalid layout format: components should be an array');
    }

    validateComponents(parsed.components);

    const bindings = parsed.bindings ?? [];

    validateBindings(bindings);

    return {
      components: parsed.components as CanvasComponent[],
      bindings: bindings as ComponentBinding[],
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw error;
  }
}

function validateComponents(components: unknown[]): void {
  const validComponents = components.every(
    (component) =>
      component &&
      typeof component === 'object' &&
      component !== null &&
      'id' in component &&
      'type' in component &&
      'position' in component &&
      'props' in component
  );

  if (!validComponents) {
    throw new Error(
      'Invalid layout format: one or more components are missing required properties'
    );
  }
}

function validateBindings(bindings: unknown[]): void {
  const validBindings = bindings.every(
    (binding) =>
      binding &&
      typeof binding === 'object' &&
      binding !== null &&
      'id' in binding &&
      'sourceId' in binding &&
      'targetId' in binding &&
      'type' in binding &&
      'config' in binding
  );

  if (!validBindings) {
    throw new Error(
      'Invalid layout format: one or more bindings are missing required properties'
    );
  }
}

export function downloadLayout(
  components: CanvasComponent[],
  bindings: ComponentBinding[] = []
): void {
  const serialized = serializeLayout(components, bindings);
  const blob = new Blob([serialized], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `schnode-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function readLayoutFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}
