import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';

const initialState: any = {
  userName: '',
  userIsSet: false,
  status: 'idle',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserIsSetState: (state, action: PayloadAction<boolean>) => {
      state.userIsSet = action.payload
    }
  },
});

export const selectUserName = (state: RootState) => state.app.userName;
export const getUserIsSet = (state: RootState) => state.app.userIsSet;

export const { setName, setUserIsSetState } = appSlice.actions;

export default appSlice.reducer;