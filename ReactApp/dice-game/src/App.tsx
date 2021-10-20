import './App.scss';
import Header from './components/header';
import GameClient from './components/gameClient';
import { selectUserName } from './app/app';
import { useAppSelector } from './app/hooks';
import {Toaster} from 'react-hot-toast';
import { selectColor } from './app/colorPicker';

// $(document).ready(() => {
//   initalizeChat(ws);
//   $('#player-input').on('submit', function (e) {
//     e.preventDefault();
//     submitName();
//   });
// });

function App() {
  const userName = useAppSelector(selectUserName);
  const selectedColor = useAppSelector(selectColor)

  return (
    <div className="App">
      <Header />
      <div className="column-container">
        <GameClient />
        <div id="all-scores" className="column">
          All Scores
        </div>
      </div>
      {userName}
      {selectedColor}
      <Toaster
        position="top-right"
      />
    </div>
  );
}

export default App;
