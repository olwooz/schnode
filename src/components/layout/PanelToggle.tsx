'use client';

import { MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PanelToggleProps {
  isOpen: boolean;
  onClick: () => void;
  panelName: string;
}

export default function PanelToggle({
  isOpen,
  onClick,
  panelName,
}: PanelToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={onClick}
            aria-label={isOpen ? `Close ${panelName}` : `Open ${panelName}`}
          >
            {isOpen ? (
              <X className='h-4 w-4' />
            ) : (
              <MenuIcon className='h-4 w-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOpen ? `Close ${panelName}` : `Open ${panelName}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
