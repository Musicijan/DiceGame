import React from 'react';
import { useState } from 'react';
import { webSocketService } from '../services/services';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { getUserIsSet, setName } from '../app/app';
import toast from 'react-hot-toast';
import { store } from '../app/store';
import ColorPicker from './colorPicker';
import { getColor } from '../app/colorPicker';


const PlayerInput = () => {
  const dispatch = useAppDispatch();
  const userIsSet = useAppSelector(getUserIsSet);
  const selectedColor = useAppSelector(getColor);
  const [userName, setUserName] = useState("");

  const handleUserNameinput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.currentTarget.value);
  }

  const submitName = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const selectedColor = store.getState().colorPicker.selectedColor;
    if (userName != '') {
      console.log(`submitName with color: ${selectedColor}`);
      webSocketService.sendMessage(
        {
          command: "add_player",
          user: userName,
          color: selectedColor
        }
      )
      dispatch(setName(userName));
    } else {
      toast.error('Input a value');
    }
  }

  const isValidSubmit = (userName !== '' && selectedColor !== '');

  return (
    <form id="player-input">
      <input type="text" value={userName} id="userName" onChange={handleUserNameinput} placeholder="Player Name" />
      <ColorPicker />
      {isValidSubmit && <button type="submit" onClick={submitName}>Submit Name</button>}
    </form>
  )
}

export default PlayerInput;