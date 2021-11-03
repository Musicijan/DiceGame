import * as React from 'react';
import { useEffect, useState } from 'react';
import { getKeptDice, getScores, setKeptDice } from '../app/diceGame';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { diceGameService } from '../services/services';
import { KeptDice, KeptDiceFromRoll, Player, Roll, RollStatus } from '../types/gameModel'
import Die from './Die';

interface PlayerProps {
  player: Player;
  playerName: string;
}

interface RollDisplayProps {
  roll: Roll;
  rollStatus: RollStatus;
  rollIndex: number;
  showConfirmKeptDice: boolean;
}

const DiceRoller = () => {
  const dispatch = useAppDispatch()
  const scores = useAppSelector(getScores);
  const keptDice = useAppSelector(getKeptDice);
  const { players } = scores;

  const [keptDiceFromRoll, setKeptDiceFromRoll] = useState([] as KeptDiceFromRoll);
  const _setKeptDice = (updatedKeptDice: any) => {
    dispatch(setKeptDice(updatedKeptDice));
  }

  const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
    const { player, playerName } = props;
    console.log(player);
    console.log('keptDiceFromRoll')
    console.log(keptDiceFromRoll);
    return (
      <div className="player-dice">
        <div className="player-name">{playerName}</div>
        Selected Dice: {keptDice.map((die: any) => die.value)}
        <div className="player-rolls">
          {player.rolls.map((roll, index) => {
            console.log(`keptDice:`)
            console.log(keptDice);
            const showConfirmKeptDice = (
              index === player.rolls.length - 1 && 
              player.rollStatus === RollStatus.AWAITING_KEPT
              // !!keptDice.find((d: KeptDie) => d.rollIndex === index)
            );
            return (
              <div className="roll-row flex" key={`RollDisplay-${index}`}>
                <div className="roll-header">Roll: {index + 1}</div>
                <RollDisplay
                  roll={roll}
                  rollIndex={index}
                  rollStatus={player.rollStatus}
                  showConfirmKeptDice={(index === player.rolls.length - 1 && player.rollStatus === RollStatus.AWAITING_KEPT)}
                />
                {/* {showConfirmKeptDice && */}
                <ConfirmKeptDiceButton />
                {/* } */}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const RollDisplay: React.FC<RollDisplayProps> = (props: RollDisplayProps) => {
    const { roll, rollStatus, rollIndex, showConfirmKeptDice } = props;
    console.log('<RollDisplay />')
    console.log(roll);
    return (
      <div className="flex">
        {roll.map((die, index) => {
          console.log(`rollStatus: ${rollStatus}`)
          return (
            <Die
              dieValue={die}
              dieIndex={index}
              isActiveRoll={showConfirmKeptDice}
              isSelectable={rollStatus === RollStatus.AWAITING_KEPT}
              key={`die-${index}`} />
          );
        })}
      </div>
    )
  }

  const Die: React.FC<any> = (props: any) => {
    const { dieValue, isSelectable, dieIndex, isActiveRoll } = props;
    const [isHovered, setHoverState] = useState(false);
    let dieIsSelected = false;
    for (let i = 0; i < keptDiceFromRoll.length; i++) {
      if (keptDiceFromRoll[i].index === dieIndex) {
        dieIsSelected = true;
        break;
      };
    }
    const isHoveredClass = (isSelectable && isHovered) ? 'hovered' : '';
    const isSelectableClass = isSelectable ? 'selectable' : '';
    const isSelectedClass = dieIsSelected ? 'selected' : '';

    const handleDieClick = () => {
      if (!dieIsSelected) {
        setKeptDiceFromRoll([
          ...keptDiceFromRoll,
          {
            value: dieValue,
            index: dieIndex,
          }
        ]);
      } else {
        // remove that mf
        setKeptDiceFromRoll([...keptDiceFromRoll].filter((d) => d.index !== dieIndex));
      }
    }

    return (
      <div
        className={`roll-value ${isSelectableClass} ${isSelectedClass} ${isHoveredClass}`}
        onMouseEnter={() => { setHoverState(true) }}
        onMouseLeave={() => { setHoverState(false) }}
        onClick={handleDieClick}
      >
        {dieValue}
      </div>
    )
  }

  // generate players as array
  const playersArray = players ? Object.keys(players) : [];

  const ConfirmKeptDiceButton = () => {
    const handleConfirmKeptDice = () => {
      diceGameService.setKeptDice([...keptDice, keptDiceFromRoll]);
      // reset keptDiceFromRoll
      setKeptDiceFromRoll([]);
    }
    return (
      <div className="kept-dice-button button" onClick={handleConfirmKeptDice}>
        Confirm
      </div>
    )
  }

  return (
    <div className="rolled-dice">
      {playersArray.length > 0 && playersArray.map((playerName: string, index: number) => {
        const player: Player = players[playerName];
        return (
          <Player player={player} playerName={playerName} key={`player-${index}`} />
        );
      })}
    </div>
  )
}

export default DiceRoller;