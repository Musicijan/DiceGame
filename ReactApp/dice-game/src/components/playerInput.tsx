import React from 'react';
import { useState } from 'react';
import { webSocketService } from '../services/services';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { getPlayerIsSet, setName } from '../app/app';
import toast from 'react-hot-toast';
import { store } from '../app/store';
import ColorPicker from './colorPicker';
import { getColor } from '../app/colorPicker';


const PlayerInput = () => {
  const dispatch = useAppDispatch();
  const playerIsSet = useAppSelector(getPlayerIsSet);
  const selectedColor = useAppSelector(getColor);
  const [playerName, setPlayerName] = useState("");

  const handlePlayerNameinput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.currentTarget.value);
  }

  const submitName = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const selectedColor = store.getState().colorPicker.selectedColor;
    if (playerName != '') {
      console.log(`submitName with color: ${selectedColor}`);
      webSocketService.sendMessage(
        {
          command: "add_player",
          player: playerName,
          color: selectedColor
        }
      )
      dispatch(setName(playerName));
    } else {
      toast.error('Input a value');
    }
  }

  const isValidSubmit = (playerName !== '' && selectedColor !== '');

  return (
    <form id="player-input">
      <input type="text" value={playerName} id="playerName" onChange={handlePlayerNameinput} placeholder="Player Name" />
      <ColorPicker />
      {isValidSubmit && <button type="submit" onClick={submitName}>Submit Name</button>}
    </form>
  )
}

export default PlayerInput;