import { memo } from 'react';

import { Button } from '@/components/ui/button';
import { DEFAULT_PROPS } from '@/constants/component';
import { ButtonProps, ComponentRendererProps } from '@/types/component';

function ButtonRenderer({ props }: ComponentRendererProps) {
  const buttonProps = { ...DEFAULT_PROPS.button, ...props } as ButtonProps;
  return (
    <Button variant={buttonProps.variant} size={buttonProps.size}>
      {buttonProps.children}
    </Button>
  );
}

export default memo(ButtonRenderer);
