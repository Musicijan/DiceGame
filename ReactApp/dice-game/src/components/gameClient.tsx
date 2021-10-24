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
import { getUserIsSet } from '../app/app';

const GameClient = () => {
  const userIsSet = useAppSelector(getUserIsSet);
  return (
    <div className="client-game column">
      {!userIsSet ? <PlayerInput /> : <PlayerHeader />} 
      {/* {!userIsSet && <ColorPicker />} */}
      {userIsSet && <RollButton /> }
      <KeptDiceDisplay />
      <CurrentScore />
      <RolledDiceDisplay />
      {userIsSet && <Chat /> }
      <ResetGameButton />
    </div>
  )
}

export default GameClient;