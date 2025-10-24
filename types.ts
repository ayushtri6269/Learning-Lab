
export interface ImagePart {
  type: 'image';
  src: string;
  mimeType: string;
}

export interface TextPart {
  type: 'text';
  text: string;
}

export type MessagePart = TextPart | ImagePart;

export interface Message {
  id: string;
  role: 'user' | 'model' | 'error';
  parts: MessagePart[];
}
