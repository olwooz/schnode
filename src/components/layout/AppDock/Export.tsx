'use client';

import { useAtomValue } from 'jotai';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { componentsAtom } from '@/atoms/component';
import { bindingsAtom } from '@/atoms/binding';
import { downloadLayout } from '@/utils/layout-io';

export function Export() {
  const components = useAtomValue(componentsAtom);
  const bindings = useAtomValue(bindingsAtom);

  function handleExport() {
    if (components.length === 0) {
      alert('There are no components to export.');
      return;
    }
    downloadLayout(components, bindings);
  }

  return (
    <Button
      className='rounded-full hover:bg-transparent'
      variant='ghost'
      size='icon'
      onClick={handleExport}
    >
      <Upload className='h-4 w-4' />
    </Button>
  );
}
