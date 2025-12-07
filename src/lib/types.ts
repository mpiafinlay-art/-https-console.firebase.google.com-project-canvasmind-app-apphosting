import { Timestamp } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export type ElementType = 
  | 'text'
  | 'sticky-note'
  | 'notepad'
  | 'tabbed-notepad'
  | 'yellow-notepad'
  | 'todo-list'
  | 'image'
  | 'comment'
  | 'accordion'
  | 'stopwatch'
  | 'countdown'
  | 'highlight-text';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number | string;
  height: number | string;
}

export interface CanvasElementProperties {
  position?: Position;
  size?: Size;
  zIndex?: number;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  [key: string]: any;
}

export interface ElementContent {
  text?: string;
  title?: string;
  label?: string;
  url?: string;
  pages?: string[];
  items?: Array<{ id: string; text: string; completed: boolean }>;
  [key: string]: any;
}

export interface CanvasElement {
  type: ElementType;
  content: ElementContent;
  properties?: CanvasElementProperties;
  zIndex?: number;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  hidden?: boolean;
  minimized?: boolean;
  parentId?: string | null;
  [key: string]: any;
}

export interface Board {
  name: string;
  userId: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  [key: string]: any;
}

export interface CommentContent extends ElementContent {
  title: string;
  label: string;
  text: string;
}

export interface NotepadContent extends ElementContent {
  pages: string[];
}

