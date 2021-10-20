import moment from 'moment';
import { addMessage } from '../app/chat';
import { store } from '../app/store';
import { WebSocketMessagePayload } from '../types/webSocketTypes';
import { diceGameService } from './services'

export interface WebSocketService {
  connectionAttempts: number;
  sendLastRolls: number;
  username: string;
  ws: WebSocket;
}

export class WebSocketService {
  constructor() {
    console.log('Creating WebSocketService');
    this.connectionAttempts = 0;
    this.sendLastRolls = 0;
    this.username = '';

    this.init();
  }

  init() {
    // set up WSS connection
    this.ws = new WebSocket('ws://localhost:3069/');

    this.ws.onopen = () => {
      try {
        console.log("Socket opened.");
        this.sendMessage({ command: "get_scores" });

        this.ws.onerror = (error) => {
          console.log(error);
          try {
            if (this.connectionAttempts < 10) {
              this.connectionAttempts++;
              this.init();
            }
          }
          catch (error) {
            console.log(error);
          }
        }

        this.ws.onmessage = (message) => {
          console.log(message);
          let msgObj = JSON.parse(message.data);
          switch (msgObj.command) {
            case "score_update":
              diceGameService.showAllScores(msgObj.data);
              break;
            case "chat_message":
              this.handleChatMessage(msgObj)
              // let newLine = `<p className="message" style="border: 2px solid ${color};">${msgObj.user || "Anonymous"}: ${messageText}</p>`;
              // $("#message-box").prepend(newLine);
              break;
            case "error":
              // code 0 = Too many dice submitted
              if (msgObj.code === 0) {
                diceGameService.reset(false);
                this.sendMessage({ command: "get_scores" });
              }
              alert(msgObj.message);
              break;
          }
          console.log(msgObj);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  public sendMessage(payload: WebSocketMessagePayload): void {
    try {
      this.ws.send(JSON.stringify({ ...payload }));
    } catch (err) {
      alert(err);
    }
  }

  handleChatMessage(msgObj: any) {
    const {user, color, date, message} = msgObj;
    const formattedDate = moment(date).format('MM/DD/YY [at] h:mm:ss a')
    console.log(`received date: ${date}`);
    console.log(`formattedDate date: ${formattedDate}`);
    store.dispatch(addMessage({
      date: formattedDate,
      user,
      color,
      message
    }))
  }
}

export default WebSocketService;
