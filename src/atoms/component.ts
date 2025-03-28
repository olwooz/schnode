import { atom } from 'jotai';
import { CanvasComponent } from '@/types/dnd';

export const componentsAtom = atom<CanvasComponent[]>([]);
export const selectedComponentAtom = atom<CanvasComponent | null>(null);
