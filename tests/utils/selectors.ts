import { COMPONENT_LIBRARY_ITEMS } from '@/constants/component';

export const selectors = {
  componentLibrary: {
    id: '[data-testid="component-library"]',
  },

  canvas: {
    id: '[data-testid="canvas"]',
    dropArea: '#canvas-drop-area',
    emptyStateMessage: {
      edit: 'text=Drag components here to build your interface',
      preview: 'text=No components to preview',
    },
    modeIndicator: '[data-testid="mode-indicator"]',
  },

  configPanel: {
    id: '[data-testid="config-panel"]',
    emptyState: 'text=Select a component to configure',
  },

  components: Object.fromEntries(
    COMPONENT_LIBRARY_ITEMS.map((item) => [item.type, `text=${item.title}`])
  ),
};
