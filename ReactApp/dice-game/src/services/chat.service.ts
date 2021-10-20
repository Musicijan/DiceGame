import toast from 'react-hot-toast';
import { store } from '../app/store';
import { selectUserName } from '../app/app';
import { Color, colorOptions } from '../types/chatTypes';
import { webSocketService } from './services';
import moment from 'moment';

interface ChatService {
}

class ChatService {
  constructor() {
  }

  public setColor(color: string) {
    webSocketService.sendMessage({
        command: "set_color",
        color
    });
  }

  public submitMessage(message: string): void {
    const userName = store.getState().app.userName;
    // check name
    if (userName !== '') {
      webSocketService.sendMessage({
        command: "chat_message",
        message,
        date: moment().format()
      });
    } else {
      toast.error("Please input a name.");
    }
  }

}

export default ChatService;






