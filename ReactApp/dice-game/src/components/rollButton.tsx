import { diceGameService } from '../services/services';


const RollButton = () => {
  const roll = () => {
    diceGameService.roll();
  }

  return (
    <div className="roll-btn">
      <button onClick={roll}>
        Roll
      </button>
    </div>
  )
}

export default RollButton;