import { WebSocket } from "ws";

export interface IPList {
  ip: string;
  color: string;
}

export interface CustomWS extends WebSocket {
  color: string;
  user: string;
  ip: string;
}

export interface DataModel {
  users: Users;
  playerOrder: string[];
  lowestScore: number | null;
  winningPlayer: string[];
}

export interface Users {
  [key: string]: User
}

export interface User {
  totalScore: number;
  rolls: number[];
  keptDice: any[];
  color?: string;
}

export interface WSMessagePayload {
  command: WSMessageCommand
}

export enum WSMessageCommand {
  addPlayer = "add_player",
  submitScore = "submit_score",
  resetGame = "reset_game",
  getScores = "get_scores",
  chatMessage = "chat_message",
  setColor = "set_color"
}

export interface WSSubmitScore extends WSMessagePayload{
  command: WSMessageCommand.submitScore;
  user: string;
  roll: number[],
  keptDice: any[]
}

export enum ErrorCodes {
  ADD_PLAYER_FAILED = 0
}