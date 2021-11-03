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
import { getUserIsActivePlayer, getActivePlayerRollStatus, showRollButton } from '../app/diceGame';
import DiceRoller from './diceRoller';

const GameClient = () => {
  const playerIsSet = useAppSelector(getPlayerIsSet);
  const _showRollButton = useAppSelector(showRollButton);
  return (
    <div className="game-client column">
      {!playerIsSet ? <PlayerInput /> : <PlayerHeader />} 
      {<DiceRoller />}
      { <RollButton /> }
      {/* {_showRollButton && <RollButton /> } */}
      <KeptDiceDisplay />
      <CurrentScore />
      <RolledDiceDisplay />
      {playerIsSet && <Chat /> }
      <ResetGameButton />
    </div>
  )
}

export default GameClient;