import ChatService from "./chat.service";
import DiceGameService from "./diceGame.service";
import WebSocketService from "./websocket.service";

export const chatService = new ChatService();
export const diceGameService = new DiceGameService();
export const webSocketService = new WebSocketService();
// const ServiceContainer = {
//   diceGameService
// }

// export default ServiceContainer;