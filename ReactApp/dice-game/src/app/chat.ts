import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, MessageObject } from '../types/chatTypes';
import { RootState } from './store';

const initialState: ChatState= {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageObject>) => {
      state.messages.push(action.payload);
    },
  },
});

export const selectMessages = (state: RootState) => state.chat.messages;

export const { addMessage } = chatSlice.actions;

export default chatSlice.reducer;