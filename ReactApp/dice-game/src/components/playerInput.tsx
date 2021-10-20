import React from 'react';
import { useState } from 'react';
import { webSocketService } from '../services/services';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { setName } from '../app/app';
import toast from 'react-hot-toast';


const PlayerInput = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState("");

  const handleUserNameinput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  }

  const submitName = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (userName != '') {
      webSocketService.sendMessage(
        {
          command: "add_player",
          user: userName,
          color: "selectedColor"
        }
      )
      dispatch(setName(userName));
    } else {
      toast.error('Input a value');
    }

    //   try {
    //     let name = document.getElementById('userName').value;
    //     if (name != '') {
    //       ws.send(JSON.stringify({
    //         command: "add_player",
    //         user: document.getElementById('userName').value,
    //         color: selectedColor
    //       }));

    //       $('#userName').attr('readonly', true);
    //       username = document.getElementById('userName').value;
    //     } else {
    //       alert("Input a value.");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
  }

  return (
    <form id="player-input">
      <input type="text" id="userName" onChange={handleUserNameinput} placeholder="Player Name" />
      <div id="color-picker"></div>
      <button type="submit" onClick={submitName}>Submit Name</button>
    </form>
  )
}

export default PlayerInput;