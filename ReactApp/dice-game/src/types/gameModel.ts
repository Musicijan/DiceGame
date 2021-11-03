// eventually source these from a common package
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
  rollStatus: RollStatus;
}

export enum RollStatus {
  NOT_ACTIVE = 0,
  AWAITING_ROLL = 1,
  AWAITING_KEPT = 2
}

export type Rolls = Roll[];
export type Roll = number[];
export type KeptDice = KeptDiceFromRoll[];
export type KeptDiceFromRoll = KeptDie[]
export type KeptDie = {
  value: number;
  index: number;
};
