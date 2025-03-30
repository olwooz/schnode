import { CanvasComponent } from '@/types/dnd';

export function serializeLayout(components: CanvasComponent[]): string {
  return JSON.stringify(components, null, 2);
}

export function deserializeLayout(json: string): CanvasComponent[] {
  try {
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid layout format: expected an array of components');
    }

    const validComponents = parsed.every(
      (component) =>
        component &&
        typeof component === 'object' &&
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

    return parsed as CanvasComponent[];
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw error;
  }
}

export function downloadLayout(
  components: CanvasComponent[],
  filename = 'layout.json'
): void {
  const json = serializeLayout(components);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readLayoutFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}
