import { Step } from 'react-joyride';

export const TUTORIAL_STEPS: Step[] = [
  {
    title: 'Canvas',
    target: '#canvas',
    content: 'The Canvas is the main area where you can design your app.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    title: 'Component Library',
    target: '#component-library',
    content: 'Drag & drop components from Component Library onto the Canvas.',
    disableBeacon: true,
    placement: 'right',
  },
  {
    title: 'Configuration',
    target: '#config-panel',
    content: 'Set properties, bindings, and styles for your components.',
    disableBeacon: true,
    placement: 'left',
  },
  {
    title: 'App Dock',
    target: '#app-dock',
    content:
      'You can import & export your app, switch between preview & edit mode, \nand toggle theme here in App Dock.',
    disableBeacon: true,
    placement: 'top',
  },
];
