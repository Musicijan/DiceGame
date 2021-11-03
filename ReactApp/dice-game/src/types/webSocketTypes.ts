import { KeptDice } from "./gameModel";

export interface WebSocketMessagePayload {
  command: string;
  player?: string;
  color?: string;
  message?: string;
  date?: string;
  keptDice?: KeptDice;
}

export interface ChatMessagePayload extends WebSocketMessagePayload{
  message: string;
  date: string;
}