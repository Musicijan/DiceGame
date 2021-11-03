import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RollStatus } from '../types/gameModel';
import { RootState, AppThunk } from './store';

const initialState: any = {
  scores: {},
  keptDice: []
};

export const diceGameSlice = createSlice({
  name: 'diceGame',
  initialState,
  reducers: {
    setScores: (state, action: PayloadAction<string>) => {
      state.scores = action.payload;
    },
    setKeptDice: (state, action: PayloadAction<[]>) => {
      state.keptDice = action.payload
    }
  },
});

export const getScores = (state: RootState) => state.diceGame.scores;
export const getKeptDice = (state: RootState) => state.diceGame.keptDice;
export const getUserIsActivePlayer = (state: RootState) => state.diceGame.scores?.activePlayer === state.app.playerName;
export const showRollButton = (state: RootState) => state.app.playerIsSet && getUserIsActivePlayer(state) && getActivePlayerRollStatus(state) === RollStatus.AWAITING_ROLL
export const getActivePlayerRollStatus = (state: RootState) => {
  if(state.diceGame.scores?.activePlayer && state.diceGame.scores?.players[state.diceGame.scores?.activePlayer]) {
    return state.diceGame.scores?.players[state.diceGame.scores?.activePlayer]?.rollStatus
  }
  return null;
};

export const { setScores, setKeptDice } = diceGameSlice.actions;

export default diceGameSlice.reducer;