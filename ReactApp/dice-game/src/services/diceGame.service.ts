import { WSMessageCommand } from '../../../../Node Webserver/src/models';
import { setScores } from '../app/diceGame';
import { store } from '../app/store';
import { KeptDice } from '../types/gameModel';
import { webSocketService } from './services';

interface DiceGameService {
  dice: number;
  rolls: [];
  keptDice: any;
}

// let dice = 5;
// let rolls = []
// let keptDice = {};

class DiceGameService {
  constructor() {
    this.dice = 5;
    this.rolls = []
    this.keptDice = {};
  }

  public reset(sendToWS: boolean = true): void {
    this.dice = 5;
    this.rolls = [];
    this.keptDice = {};
    // $('.kept-dice').html('Kept: ');
    // $('.rolled-dice').empty();
    // $('#current-score').html('0');
    // $('#all-scores').empty();

    if (sendToWS) {
      webSocketService.sendMessage({ command: "reset_game" });
    }
  }

  public roll() {
    console.log('roll!');
    webSocketService.sendMessage({ command: "roll_dice" });
  }

  public setKeptDice(keptDice: KeptDice) {
    console.log('Set Kept dice');
    webSocketService.sendMessage({
      command: "set_kept_dice",
      keptDice
    })
  }

  verifyRoll() {
    // if ($('#playerName').val() === '') {
    //   alert("Please input a name");
    //   return false;
    // }
    // if (dice === 5 && rolls.length === 0) return true
    // if (dice === 0) {
    //   alert("All dice have been rolled.");
    //   return false
    // };
    // if (dice === rolls[rolls.length - 1].length) {
    //   alert("Pick at least one die.");
    //   return false;
    // }
    return true;
  }

  // function displayRoll() {
  //   let lastRoll = rolls[rolls.length - 1];
  //   $('.rolled-dice').append(diceRow());

  //   let rollId;
  //   for (let i = 0; i < lastRoll.length; i++) {
  //     rollId = `${rolls.length}-${i}`
  //     $(`#roll-${rolls.length}`).append(rollValue(lastRoll[i], rollId));
  //   }

  //   if (rolls.length === 5) { // autopick last roll
  //     keepDie(rollId, lastRoll[0]);
  //   }
  // }

  // function diceRow(roll: any) {
  //   return `<div class='dice-row' id='roll-${rolls.length}'><span class='roll-number'>Roll ${rolls.length}: </span></div>`
  // }

  // function rollValue(value: any, rollId: any) {
  //   return `<span class='row-value unselectable' id='${rollId}' onClick='keepDie("${rollId}", ${value})'>${value}</span>`
  // }

  // function keepDie(rollId: any, value: any) {
  //   // validate first
  //   if (rollId.split('-')[0] < rolls.length) {
  //     return false;
  //   }

  //   if (!keptDice[rollId]) {
  //     keptDice[rollId] = value;
  //     $(`#${rollId}`).addClass('active');
  //     dice--;
  //   } else {
  //     $(`#${rollId}`).removeClass('active');
  //     delete keptDice[rollId];
  //     dice++;
  //   }

  //   displayKept();
  //   displayScore();

  //   if (dice === 0) {
  //     sendLastRoll();
  //     setTimeout(() => {
  //       alert(`Game over! Score is ${displayScore()}`)
  //     }, 200);
  //   }
  // }

  // function displayKept() {
  //   $('.kept-dice').empty();
  //   $('.kept-dice').append('Kept: ');
  //   for (let die in keptDice) {
  //     $('.kept-dice').append(`<span>${keptDice[die]}, </span>`);
  //   }
  // }

  // function displayScore() {
  //   let score = 0;
  //   for (let die in keptDice) {
  //     if (keptDice[die] != 3) {
  //       score += keptDice[die];
  //     }
  //   }

  //   $('#current-score').html(score);
  //   return score;
  // }


  // sendLastRoll() {
  //   try {
  //     const playerName = store.getState().app.playerName;
  //     webSocketService.sendMessage({
  //       command: "submit_score",
  //       player: playerName,
  //       roll: this.rolls[this.rolls.length - 1],
  //       keptDice: this.keptDice
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     if (this.sendLastRolls < 10) {
  //       console.log("sendlastroll failed");
  //       this.sendLastRoll();
  //       this.sendLastRolls++;
  //     }
  //   }
  // }

  public showAllScores(allScores: any): void {
      console.log(allScores);
      store.dispatch(setScores(allScores));
    //   console.log(allScores);
    //   $('#all-scores').empty();

    //   // player order
    //   if (allScores.lowestScore != null) {
    //     $('#all-scores').append(`<div id='current-winner'><b>Current Winner: </b>${allScores.winningPlayer} - ${allScores.lowestScore} Points</div>`);
    //   }
    //   $('#all-scores').append(`<div id='player-order'>${allScores.playerOrder}</div>`);

    //   for (let playername in allScores.players) {
    //     let player = allScores.players[playername];
    //     $('#all-scores').append(`<div class='player-entry' id='p-${playername.replace(/\W/g, '')}'><div class='player-name'>${playername}: ${player.totalScore}</div></div>`);
    //     for (let i = 0; i < player.rolls.length; i++) {
    //       let rollRow = '';
    //       player.rolls[i].map((roll, index) => {
    //         let isKept = player.keptDice[`${i + 1}-${index}`] != undefined ? 'active' : '';
    //         let colorindex = colors.indexOf(player.color);
    //         let lightColorText = colorindex < 4 ? "color: white" : "";
    //         let style = isKept ? `background: ${player.color}; ${lightColorText}` : '';
    //         // let style = isKept ? `border: 1px solid ${player.color}` : '';
    //         rollRow += `<span class='roll-value ${isKept}' style='${style}'>${roll}</span>`;
    //       })
    //       $(`.player-entry#p-${playername.replace(/\W/g, '')}`).append(`<div class='roll-row unselectable'><span>Roll ${i + 1}: </span>${rollRow}</div>`);

    //     }
    //   }
  }

}

export default DiceGameService;






