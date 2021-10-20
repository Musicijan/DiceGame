import * as React from 'react';
import PlayerInput from './playerInput';
import Chat from './chat';
import RollButton from './rollButton';
import KeptDiceDisplay from './keptDiceDisplay';
import CurrentScore from './currentScore';
import RolledDiceDisplay from './rolledDiceDisplay';
import ResetGameButton from './resetGameButton';
import ColorPicker from './colorPicker';

const GameClient = () => {
  return (
    <div className="client-game column">
      <PlayerInput />
      <ColorPicker />
      <RollButton />
      <KeptDiceDisplay />
      <CurrentScore />
      <RolledDiceDisplay />
      <ResetGameButton />
      <Chat />
    </div>
  )
}

export default GameClient;