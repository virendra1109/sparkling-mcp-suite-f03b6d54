export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  queryResult?: any;
  processingTime?: number;
}

export interface ExampleQuery {
  id: string;
  text: string;
  icon: string;
}
