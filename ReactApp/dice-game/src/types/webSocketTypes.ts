export interface WebSocketMessagePayload {
  command: string;
  player?: string;
  color?: string;
  message?: string;
  date?: string;
}

export interface ChatMessagePayload extends WebSocketMessagePayload{
  message: string;
  date: string;
}