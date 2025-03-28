import { useAtom, useSetAtom } from 'jotai';
import { isPreviewModeAtom } from '@/atoms/mode';
import { selectedComponentAtom } from '@/atoms/component';

export function useTogglePreviewMode() {
  const [isPreviewMode, setIsPreviewMode] = useAtom(isPreviewModeAtom);
  const setSelectedComponent = useSetAtom(selectedComponentAtom);

  function togglePreviewMode() {
    if (isPreviewMode) {
      setSelectedComponent(null);
    }

    setIsPreviewMode(!isPreviewMode);
  }

  return {
    isPreviewMode,
    togglePreviewMode,
  };
}
