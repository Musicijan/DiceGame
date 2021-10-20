import * as React from 'react';
import {diceGameService} from '../services/services'

const ResetGameButton = () => {
  const resetClickHandler = () => {
    diceGameService.reset();
  }

  return (
    <div className="reset-game">
      <button id="reset-game" onClick={resetClickHandler}>Reset Game</button>
    </div>
  )
}

export default ResetGameButton;