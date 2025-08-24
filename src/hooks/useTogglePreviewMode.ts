import { useEffect } from 'react';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { selectedComponentIdAtom } from '@/atoms/component';
import { isMobileAtom } from '@/atoms/isMobile';
import { isPreviewModeAtom } from '@/atoms/mode';
import { useDeviceContext } from '@/components/ClientDeviceProvider';

export function useTogglePreviewMode() {
  const [isPreviewMode, setIsPreviewMode] = useAtom(isPreviewModeAtom);
  const setSelectedComponentId = useSetAtom(selectedComponentIdAtom);
  const isMobile = useAtomValue(isMobileAtom);

  const isMobileContext = useDeviceContext();

  const effectiveMobile = isMobileContext || isMobile;

  function togglePreviewMode() {
    if (effectiveMobile && isPreviewMode) {
      return;
    }

    if (!isPreviewMode) {
      setSelectedComponentId(null);
    }

    setIsPreviewMode(!isPreviewMode);
  }

  useEffect(() => {
    if (!effectiveMobile || isPreviewMode) {
      return;
    }

    setSelectedComponentId(null);
    setIsPreviewMode(true);
  }, [effectiveMobile, isPreviewMode, setIsPreviewMode, setSelectedComponentId]);

  return {
    isPreviewMode,
    togglePreviewMode,
    isMobile: effectiveMobile,
  };
}
