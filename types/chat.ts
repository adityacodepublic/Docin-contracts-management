export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  documentId?: string;  // Added this field as optional
}

export interface StructuredData {
  title: string;
  description: string;
  expirationDate: string | null;
}

export interface QueryResponse {
  markdown: string;
  structured: StructuredData | null;
}

export function isQueryResponse(response: any): response is QueryResponse {
  return typeof response === 'object' && 
         response !== null && 
         'markdown' in response && 
         'structured' in response;
}
