import './App.scss';
import Header from './components/header';
import GameClient from './components/gameClient';
import { selectPlayerName } from './app/app';
import { useAppSelector } from './app/hooks';
import { Toaster } from 'react-hot-toast';
import { getColor } from './app/colorPicker';
import { getScores } from './app/diceGame';

// $(document).ready(() => {
//   initalizeChat(ws);
//   $('#player-input').on('submit', function (e) {
//     e.preventDefault();
//     submitName();
//   });
// });

function App() {
  const playerName = useAppSelector(selectPlayerName);
  const selectedColor = useAppSelector(getColor);
  const scores = useAppSelector(getScores);
  console.log(scores);
  return (
    <div className="App">
      <Header />
      <div className="column-container">
        <GameClient />
        <div id="all-scores" className="column">
          <div>
            Active Player: {scores.activePlayer}
          </div>
          All Scores
        </div>
      </div>
      {playerName}
      {selectedColor}
      <Toaster
        position="top-right"
      />
    </div>
  );
}

export default App;
