'use client';

import { useAtomValue } from 'jotai';
import { Info } from 'lucide-react';

import { isMobileAtom } from '@/atoms/isMobile';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MobileNotice() {
  const isMobile = useAtomValue(isMobileAtom);

  if (!isMobile) {
    return null;
  }

  return (
    <Alert className='mb-2 relative pr-8'>
      <Info className='h-4 w-4' />
      <AlertDescription className='text-xs md:text-sm'>
        Edit mode is not supported on mobile devices.
        <br />
        Please use a desktop device for full editing capabilities.
      </AlertDescription>
    </Alert>
  );
}
