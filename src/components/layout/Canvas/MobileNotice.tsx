'use client';

import { useAtomValue } from 'jotai';
import { Info } from 'lucide-react';

import { isMobileAtom } from '@/atoms/isMobile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function MobileNotice() {
  const isMobile = useAtomValue(isMobileAtom);

  return (
    <Alert
      className={cn('mb-2 relative pr-8 opacity-0', {
        'opacity-100': isMobile,
      })}
    >
      <Info className='h-4 w-4' />
      <AlertDescription className='text-xs md:text-sm'>
        Edit mode is not supported on mobile devices.
        <br />
        Please use a desktop device for full editing capabilities.
      </AlertDescription>
    </Alert>
  );
}
