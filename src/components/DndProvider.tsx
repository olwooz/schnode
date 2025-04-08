'use client';

import { ReactNode } from 'react';

import { DndProvider as ReactDndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type DndProviderProps = {
  children: ReactNode;
};

export default function DndProvider({ children }: DndProviderProps) {
  return <ReactDndProvider backend={HTML5Backend}>{children}</ReactDndProvider>;
}
