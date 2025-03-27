export type ContentItem = {
  id: string;
  type: 'input' | 'select';
  props: Record<string, string>;
};

export type ActionButton = {
  id: string;
  text: string;
  variant: string;
  size: string;
};

export type EditorItem = ContentItem | ActionButton;
