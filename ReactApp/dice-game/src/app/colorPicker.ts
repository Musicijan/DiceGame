import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialState: any = {
  selectedColor: '',
};

export const colorPickerSlice = createSlice({
  name: 'colorPicker',
  initialState,
  reducers: {
    setColor: (state, action: PayloadAction<string>) => {
      state.selectedColor = action.payload;
    },
  },
});

export const selectColor = (state: RootState) => state.colorPicker.selectedColor;

export const { setColor } = colorPickerSlice.actions;

export default colorPickerSlice.reducer;