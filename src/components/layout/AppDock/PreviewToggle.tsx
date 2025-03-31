import { Eye, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTogglePreviewMode } from '@/hooks/useTogglePreviewMode';

export function PreviewToggle() {
  const { isPreviewMode, togglePreviewMode, isMobile } = useTogglePreviewMode();

  return (
    <Button
      onClick={togglePreviewMode}
      variant='ghost'
      size='icon'
      title={isPreviewMode ? 'Switch to edit mode' : 'Switch to preview mode'}
      disabled={isMobile}
      className='hover:bg-transparent'
    >
      {isPreviewMode ? (
        <Pencil className='h-4 w-4' />
      ) : (
        <Eye className='h-4 w-4' />
      )}
    </Button>
  );
}
