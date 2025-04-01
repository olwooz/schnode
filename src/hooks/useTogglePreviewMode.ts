import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { isPreviewModeAtom } from '@/atoms/mode';
import { selectedComponentAtom } from '@/atoms/component';
import { isMobileAtom } from '@/atoms/isMobile';
import { useDeviceContext } from '@/components/ClientDeviceProvider';

export function useTogglePreviewMode() {
  const [isPreviewMode, setIsPreviewMode] = useAtom(isPreviewModeAtom);
  const setSelectedComponent = useSetAtom(selectedComponentAtom);
  const isMobile = useAtomValue(isMobileAtom);

  const isMobileContext = useDeviceContext();

  const effectiveMobile = isMobileContext || isMobile;

  function togglePreviewMode() {
    if (effectiveMobile && isPreviewMode) {
      return;
    }

    if (!isPreviewMode) {
      setSelectedComponent(null);
    }

    setIsPreviewMode(!isPreviewMode);
  }

  useEffect(() => {
    if (!effectiveMobile || isPreviewMode) {
      return;
    }

    setSelectedComponent(null);
    setIsPreviewMode(true);
  }, [effectiveMobile, isPreviewMode, setIsPreviewMode, setSelectedComponent]);

  return {
    isPreviewMode,
    togglePreviewMode,
    isMobile: effectiveMobile,
  };
}
