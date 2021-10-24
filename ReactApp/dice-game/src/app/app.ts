import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';

const initialState: any = {
  playerName: '',
  playerIsSet: false,
  status: 'idle',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    setPlayerIsSetState: (state, action: PayloadAction<boolean>) => {
      state.playerIsSet = action.payload
    }
  },
});

export const selectPlayerName = (state: RootState) => state.app.playerName;
export const getPlayerIsSet = (state: RootState) => state.app.playerIsSet;

export const { setName, setPlayerIsSetState } = appSlice.actions;

export default appSlice.reducer;