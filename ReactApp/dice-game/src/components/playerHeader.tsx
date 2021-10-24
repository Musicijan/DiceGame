import { useAppSelector,  } from '../app/hooks';
import { selectUserName } from '../app/app';


const PlayerInput = () => {
  const userName = useAppSelector(selectUserName);

  return (
    <div id="player-header">
      Player name: <span id="player-name">{userName}</span>
    </div>
  )
}

export default PlayerInput;