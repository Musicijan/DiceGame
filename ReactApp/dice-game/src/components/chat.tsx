import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { selectMessages } from '../app/chat';
import { useAppSelector } from '../app/hooks';
import { chatService } from '../services/services';
import { MessageObject } from '../types/chatTypes';

interface MessageProps {
  message: MessageObject
}

const Chat = () => {
  const messages = useAppSelector(selectMessages);
  const [message, setMessage] = useState("");

  const messageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget.value);
  }

  const submitMessageHandler = async (event: React.SyntheticEvent) => {
    try {
      event.preventDefault();
      await chatService.submitMessage(message);
      setMessage("");
    } catch(err) {
      toast.error("Please input a name.");
    }
  }

  const Message: React.FC<MessageProps> = (props: MessageProps) => {
    const messageObj = props.message;
    const { color, date, user, message } = messageObj;

    return (
      <div className={`message flex ${color}`} style={{border: `2px solid ${color}`}}>
        <div className="date">{date}</div>
        <div className="user">{user}:</div>
        <div className="messageContent">{message}</div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <form id="chat-form" className="flex">
        <input id="message-input" value={message} type="text" autoComplete="off" onChange={messageInputHandler} />
        <button type="submit" onClick={submitMessageHandler}>Send</button>
      </form>
      <div id="message-box">
        {messages.map((message, index) => {
          return (
            <Message message={message} key={index} />
          )
        })}
      </div>
    </div>
  )
}

export default Chat;