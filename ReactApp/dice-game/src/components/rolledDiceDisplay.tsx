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
}

const RolledDiceDisplay = () => {
  const scores = useAppSelector(getScores);
  const keptDice = useAppSelector(getKeptDice);
  const { players } = scores;

  const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
    const { player, playerName } = props;

    return (
      <div className="player-dice">
        <div className="player-name">{playerName}</div>
        Selected Dice: {keptDice.map((die: any) => die.value)}
        <div className="player-rolls">
          {player.rolls.map((roll, index) => {
            return (
              <div className="roll-row flex" key={`RollDisplay-${index}`}>
                <div className="roll-header">Roll: {index + 1}</div>
                <RollDisplay roll={roll} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const RollDisplay: React.FC<RollDisplayProps> = (props: RollDisplayProps) => {
    const { roll } = props;
    return (
      <div className="flex">
        {roll.map((die, index) => {
          return (
            <Die die={die} key={`die-${index}`} />
          );
        })}
      </div>
    )
  }

  const Die: React.FC<any> = (props: any) => {
    const { die } = props;

    return (
      <div className={`roll-value`}>
        {die}
      </div>
    )
  }

  // generate players as array
  const playersArray = players ? Object.keys(players) : [];

  return (
    <div className="rolled-dice">
      {playersArray.length > 0 && playersArray.map((playerName: string, index: number) => {
        const player: Player = players[playerName];
        console.log(player);
        return (
          <Player player={player} playerName={playerName} key={`player-${index}`} />
        );
      })}
    </div>
  )
}

export default RolledDiceDisplay;