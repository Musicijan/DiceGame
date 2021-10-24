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

  // vestigial function, deprecating now that UI disallows color change
  public setColor(color: string) {
    webSocketService.sendMessage({
        command: "set_color",
        color
    });
  }

  public async submitMessage(message: string): Promise<void> {
    const userIsSet = store.getState().app.userIsSet;
    // check name
    if (userIsSet) {
      webSocketService.sendMessage({
        command: "chat_message",
        message,
        date: moment().format()
      });
    } else {
      throw Error;
    }
  }

}

export default ChatService;






