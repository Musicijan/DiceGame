import { useAppSelector,  } from '../app/hooks';
import { selectPlayerName } from '../app/app';


const PlayerInput = () => {
  const playerName = useAppSelector(selectPlayerName);

  return (
    <div id="player-header">
      Player name: <span id="player-name">{playerName}</span>
    </div>
  )
}

export default PlayerInput;