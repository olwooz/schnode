import { Eye, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTogglePreviewMode } from '@/hooks/useTogglePreviewMode';

export function PreviewToggle() {
  const { isPreviewMode, togglePreviewMode } = useTogglePreviewMode();

  return (
    <Button onClick={togglePreviewMode} variant='default' size='icon'>
      {isPreviewMode ? (
        <Pencil className='h-4 w-4' />
      ) : (
        <Eye className='h-4 w-4' />
      )}
    </Button>
  );
}
