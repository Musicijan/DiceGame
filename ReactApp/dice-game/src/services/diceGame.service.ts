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
    if (!this.verifyRoll()) return false;

    // if (this.dice != 5) {
    //   sendLastRoll();
    // }

    // if (dice === 5) {
    //   $('#userName').attr('readonly', true);
    // }

    // let roll = []
    // for (let i = 0; i < dice; i++) {
    //   roll.push(Math.floor(Math.random() * 6) + 1)
    // }
    // rolls.push(roll);
    // console.log(rolls);

    // displayRoll();
  }

  verifyRoll() {
    // if ($('#userName').val() === '') {
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


  // function sendLastRoll() {
  //   try {

  //     ws.send(JSON.stringify({
  //       command: "submit_score",
  //       user: document.getElementById('userName').value,
  //       roll: rolls[rolls.length - 1],
  //       keptDice: keptDice
  //     }));
  //   } catch (error) {
  //     console.log(error);
  //     if (sendLastRolls < 10) {
  //       console.log("sendlastroll failed");
  //       sendLastRoll();
  //       sendLastRolls++;
  //     }
  //   }
  // }

  public showAllScores(allScores: any): void {
    //   console.log(allScores);
    //   console.log(allScores);
    //   $('#all-scores').empty();

    //   // player order
    //   if (allScores.lowestScore != null) {
    //     $('#all-scores').append(`<div id='current-winner'><b>Current Winner: </b>${allScores.winningPlayer} - ${allScores.lowestScore} Points</div>`);
    //   }
    //   $('#all-scores').append(`<div id='player-order'>${allScores.playerOrder}</div>`);

    //   for (let username in allScores.users) {
    //     let user = allScores.users[username];
    //     $('#all-scores').append(`<div class='player-entry' id='p-${username.replace(/\W/g, '')}'><div class='player-name'>${username}: ${user.totalScore}</div></div>`);
    //     for (let i = 0; i < user.rolls.length; i++) {
    //       let rollRow = '';
    //       user.rolls[i].map((roll, index) => {
    //         let isKept = user.keptDice[`${i + 1}-${index}`] != undefined ? 'active' : '';
    //         let colorindex = colors.indexOf(user.color);
    //         let lightColorText = colorindex < 4 ? "color: white" : "";
    //         let style = isKept ? `background: ${user.color}; ${lightColorText}` : '';
    //         // let style = isKept ? `border: 1px solid ${user.color}` : '';
    //         rollRow += `<span class='roll-value ${isKept}' style='${style}'>${roll}</span>`;
    //       })
    //       $(`.player-entry#p-${username.replace(/\W/g, '')}`).append(`<div class='roll-row unselectable'><span>Roll ${i + 1}: </span>${rollRow}</div>`);

    //     }
    //   }
  }

}

export default DiceGameService;






