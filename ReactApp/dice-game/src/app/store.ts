import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import appReducer from './app'
import colorPickerReducer from './colorPicker'
import chatReducer from './chat'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    colorPicker: colorPickerReducer,
    chat: chatReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
