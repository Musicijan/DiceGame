import { WebSocket } from "ws";

// WebSocket
export interface IPList {
  ip: string;
  color: string;
}

export interface CustomWS extends WebSocket {
  color: string;
  player: string;
  ip: string;
}

export interface GameDataModel {
  players: Players;
  playerOrder: string[];
  lowestScore: number | null;
  winningPlayer: string[];
  activePlayer: string | null;
}

export interface Players {
  [key: string]: Player
}

export interface Player {
  totalScore: number;
  rolls: Rolls;
  keptDice: KeptDice;
  color?: string;
}

export interface WSMessagePayload {
  command: WSMessageCommand
}

export enum WSMessageCommand {
  // player commands
  addPlayer = "add_player",
  addedPlayer = "added_player",

  // game commands
  submitScore = "submit_score",
  scoreUpdate = "score_update",
  resetGame = "reset_game",
  getScores = "get_scores",

// game engine commands
  rollDice = "roll_dice",
  
  // misc
  error = "error",
  chatMessage = "chat_message",
  setColor = "set_color",
}
export interface WSSubmitScore extends WSMessagePayload{
  command: WSMessageCommand.submitScore;
  player: string;
  roll: Roll,
  keptDice: KeptDice
}


// Error Codes
export enum ErrorCodes {
  ADD_PLAYER_FAILED = 0,
}

export enum DiceGameServiceErrorCodes {
  ALL_DICE_HAVE_BEEN_ROLLED = 0,
  DIE_NOT_PICKED = 1,
  NOT_ACTIVE_PLAYER = 2,
}

// GameLogic
export type Rolls = Roll[];
export type Roll = number[];
export type KeptDice = number[];