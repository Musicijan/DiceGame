export interface WebSocketMessagePayload {
  command: string;
  user?: string;
  color?: string;
  message?: string;
  date?: string;
}

export interface ChatMessagePayload extends WebSocketMessagePayload{
  message: string;
  date: string;
}