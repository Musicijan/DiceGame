import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';

const initialState: any = {
  scores: {},
};

export const diceGameSlice = createSlice({
  name: 'diceGame',
  initialState,
  reducers: {
    setScores: (state, action: PayloadAction<string>) => {
      state.scores = action.payload;
    },
  },
});

export const getScores = (state: RootState) => state.diceGame.scores;
export const getUserIsActivePlayer = (state: RootState) => state.diceGame.scores?.activePlayer === state.app.playerName;

export const { setScores } = diceGameSlice.actions;

export default diceGameSlice.reducer;