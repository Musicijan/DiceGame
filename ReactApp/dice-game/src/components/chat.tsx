import * as React from 'react';
import { useState } from 'react';
import { selectMessages } from '../app/chat';
import { useAppSelector } from '../app/hooks';
import { chatService } from '../services/services';


const Chat = () => {
  const messages = useAppSelector(selectMessages);
  const [message, setMessage] = useState("");

  const messageInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.currentTarget.value);
  }

  const submitMessageHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    chatService.submitMessage(message);
  }

  return (
    <div className="chat-container">
      <form id="chat-form">
        <input id="message-input" type="text" autoComplete="off" onChange={messageInputHandler}/>
        <button type="submit" onClick={submitMessageHandler}>Send</button>
      </form>
      <div id="message-box">
        {messages.map((message) => {
          return (
            <div>
              {message.message}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Chat;