import * as React from 'react';
import PlayerHeader from './playerHeader';
import PlayerInput from './playerInput';
import Chat from './chat';
import RollButton from './rollButton';
import KeptDiceDisplay from './keptDiceDisplay';
import CurrentScore from './currentScore';
import RolledDiceDisplay from './rolledDiceDisplay';
import ResetGameButton from './resetGameButton';
import ColorPicker from './colorPicker';
import { useAppSelector } from '../app/hooks';
import { getPlayerIsSet } from '../app/app';
import { getUserIsActivePlayer } from '../app/diceGame';

const GameClient = () => {
  const playerIsSet = useAppSelector(getPlayerIsSet);
  const userIsActivePlayer = useAppSelector(getUserIsActivePlayer);

  console.log(userIsActivePlayer);
  return (
    <div className="client-game column">
      {!playerIsSet ? <PlayerInput /> : <PlayerHeader />} 
      {(playerIsSet && userIsActivePlayer) && <RollButton /> }
      <KeptDiceDisplay />
      <CurrentScore />
      <RolledDiceDisplay />
      {playerIsSet && <Chat /> }
      <ResetGameButton />
    </div>
  )
}

export default GameClient;