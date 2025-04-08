import { useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { selectedComponentAtom } from '@/atoms/component';
import { isMobileAtom } from '@/atoms/isMobile';
import { isPreviewModeAtom } from '@/atoms/mode';

export function useTogglePreviewMode() {
  const [isPreviewMode, setIsPreviewMode] = useAtom(isPreviewModeAtom);
  const setSelectedComponent = useSetAtom(selectedComponentAtom);
  const isMobile = useAtomValue(isMobileAtom);

  function togglePreviewMode() {
    if (isMobile && isPreviewMode) {
      return;
    }

    if (!isPreviewMode) {
      setSelectedComponent(null);
    }

    setIsPreviewMode(!isPreviewMode);
  }

  useEffect(() => {
    if (!isMobile || isPreviewMode) {
      return;
    }

    setSelectedComponent(null);
    setIsPreviewMode(true);
  }, [isMobile, isPreviewMode, setIsPreviewMode, setSelectedComponent]);

  return {
    isPreviewMode,
    togglePreviewMode,
    isMobile,
  };
}
