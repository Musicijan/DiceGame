import moment from 'moment';
import toast from 'react-hot-toast';
import { setPlayerIsSetState } from '../app/app';
import { addMessage } from '../app/chat';
import { store } from '../app/store';
import { WebSocketMessagePayload } from '../types/webSocketTypes';
import { diceGameService } from './services'

export interface WebSocketService {
  connectionAttempts: number;
  sendLastRolls: number;
  playername: string;
  ws: WebSocket;
  messageQueue: WebSocketMessagePayload[];
}

export class WebSocketService {
  constructor() {
    console.log('Creating WebSocketService');
    this.connectionAttempts = 0;
    this.sendLastRolls = 0;
    this.playername = '';
    this.messageQueue = [];

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
              break;
            case "error":
              // code 0 = Too many dice submitted
              if (msgObj.code === 0) {
                diceGameService.reset(false);
                this.sendMessage({ command: "get_scores" });
              }
              toast(msgObj.message);
              break;
            case "added_player":
              store.dispatch(setPlayerIsSetState(true));
          }
          console.log(msgObj);
        }
        
        // send any messages that were in queue upon successful WS connection
        this.sendQueuedMessages();
      } catch (error) {
        console.log(error);
      }
    }
  }

  public sendMessage(payload: WebSocketMessagePayload): void {
    try {
      this.messageQueue.push(payload);
      this.sendQueuedMessages();
    } catch (err) {
      alert(err);
    }
  }

  sendQueuedMessages() {
    if (this.ws.readyState === 1) {
      this.messageQueue.forEach(() => {
        const message = this.messageQueue.shift();
        this.ws.send(JSON.stringify({ ...message }));
      })
    } else {
      this.init();
    }
  }

  handleChatMessage(msgObj: any) {
    const { player, color, date, message } = msgObj;
    const formattedDate = moment(date).format('MM/DD/YY [at] h:mm:ss a')
    console.log(`received date: ${date}`);
    console.log(`formattedDate date: ${formattedDate}`);
    store.dispatch(addMessage({
      date: formattedDate,
      player,
      color,
      message
    }))
  }
}

export default WebSocketService;
