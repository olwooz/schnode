'use client';

import { createContext, useContext, useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { isMobileAtom } from '@/atoms/isMobile';
import { isPreviewModeAtom } from '@/atoms/mode';

const DeviceContext = createContext<boolean>(false);

export function useDeviceContext() {
  return useContext(DeviceContext);
}

export default function ClientDeviceProvider({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) {
  const setIsMobileState = useSetAtom(isMobileAtom);
  const setIsPreviewMode = useSetAtom(isPreviewModeAtom);

  useEffect(() => {
    setIsMobileState(isMobile);
    setIsPreviewMode(isMobile);
  }, [isMobile, setIsMobileState, setIsPreviewMode]);

  return (
    <DeviceContext.Provider value={isMobile}>{children}</DeviceContext.Provider>
  );
}
