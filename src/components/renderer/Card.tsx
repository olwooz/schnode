import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_PROPS } from '@/constants/component';
import {
  CardProps,
  ComponentRendererProps,
  ContentItem,
} from '@/types/component';
import { ActionButton } from '@/types/card';

import InputRenderer from './Input';
import SelectRenderer from './Select';
import ButtonRenderer from './Button';

export default function CardRenderer({ props }: ComponentRendererProps) {
  const cardProps = { ...DEFAULT_PROPS.card, ...props } as CardProps;

  const contentItems = cardProps.contentItems
    ? JSON.parse(cardProps.contentItems)
    : [];

  const actionButtons = cardProps.actionButtons
    ? JSON.parse(cardProps.actionButtons)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardProps.title}</CardTitle>
        {cardProps.description && (
          <div className='text-sm text-muted-foreground mt-1'>
            {cardProps.description}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <p>{cardProps.content}</p>

          {contentItems.length > 0 && (
            <div className='space-y-3'>
              {contentItems.map((item: ContentItem) => (
                <div key={item.id}>
                  {item.type === 'input' ? (
                    <InputRenderer props={item.props} />
                  ) : (
                    <SelectRenderer props={item.props} />
                  )}
                </div>
              ))}
            </div>
          )}

          {actionButtons.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-4'>
              {actionButtons.map((button: ActionButton) => (
                <ButtonRenderer key={button.id} props={button} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
