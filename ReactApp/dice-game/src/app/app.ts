import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';

const initialState: any = {
  userName: '',
  status: 'idle',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
  },
});

export const selectUserName = (state: RootState) => state.app.userName;

export const { setName } = appSlice.actions;

export default appSlice.reducer;