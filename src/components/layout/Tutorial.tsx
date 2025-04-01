import { useAtom } from 'jotai';
import Joyride, { CallBackProps, TooltipRenderProps } from 'react-joyride';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { showTutorialAtom } from '@/atoms/tutorial';
import { TUTORIAL_STEPS } from '@/constants/tutorial';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';

function CustomTooltip(props: TooltipRenderProps) {
  const { backProps, primaryProps, index, skipProps, step, tooltipProps } =
    props;

  return (
    <div
      className={cn(
        'absolute w-96',
        step.placement === 'top' && '-translate-x-1/2 -translate-y-full',
        step.placement === 'bottom' && '-translate-x-1/2',
        step.placement === 'left' && '-translate-x-full -translate-y-full',
        step.placement === 'right' && '-translate-y-full'
      )}
      {...tooltipProps}
    >
      <GlowEffect mode='colorShift' scale={0.95} />
      <div className='relative'>
        <Card className='tooltip__body relative'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold'>
              {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent>{step.content}</CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='destructive'
              className='tooltip__button'
              {...skipProps}
            >
              Skip tutorial
            </Button>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                className='tooltip__button'
                {...backProps}
              >
                <ChevronLeft className='h-4 w-4 text-muted-foreground' />
              </Button>
              <span className='text-sm text-muted-foreground'>
                {`${index + 1}/${TUTORIAL_STEPS.length}`}
              </span>
              <Button
                variant='ghost'
                size='icon'
                className='tooltip__button tooltip__button--primary'
                {...primaryProps}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function Tutorial() {
  const [showTutorial, setShowTutorial] = useAtom(showTutorialAtom);

  function handleHideTutorial(data: CallBackProps) {
    if (!['close', 'skip'].includes(data.action) && data.type !== 'tour:end') {
      return;
    }

    setShowTutorial(false);
  }

  return (
    <Joyride
      steps={TUTORIAL_STEPS}
      run={showTutorial}
      callback={handleHideTutorial}
      tooltipComponent={CustomTooltip}
      floaterProps={{
        hideArrow: true,
      }}
      continuous
      disableOverlayClose
    />
  );
}
