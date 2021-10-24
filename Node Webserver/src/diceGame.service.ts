import { broadcast, broadcastScoreUpdate } from ".";
import { getGameData, writeScores } from "./database";
import { CustomWS, GameDataModel, DiceGameServiceErrorCodes, KeptDice, Roll, Rolls } from "./models";

interface DiceGameService {
  activePlayer: string | null;
  dice: number;
  rolls: Rolls;
  keptDice: KeptDice;
}

class DiceGameService {
  constructor() {
    this.dice = 5;
    this.rolls = []
    this.keptDice = [];

    this.init();
  }

  async init() {
    const gameData = await getGameData();
    this.activePlayer = gameData.activePlayer;
  }

  public setActivePlayer(activePlayer: string) {
    this.activePlayer = activePlayer;
  }

  public roll(player: string) {
    console.log('roll!');
    try {
      this.verifyRoll(player);
    } catch (error) {
      console.log(error);
      throw error;
    }

    const roll = this.rollDice()
    this.rolls.push(roll);
    console.log(this.rolls);

    // return roll;
    this.updateGameState();
  }

  rollDice(): Roll {
    let roll = []
    for (let i = 0; i < this.dice; i++) {
      roll.push(Math.floor(Math.random() * 6) + 1)
    }

    return roll;
  }

  verifyRoll(requestingPlayer: string) {
    if (requestingPlayer !== this.activePlayer) {
      console.log(requestingPlayer);
      console.log(this.activePlayer);
      throw {
        message: "It is not this player's turn.",
        errorCode: DiceGameServiceErrorCodes.NOT_ACTIVE_PLAYER
      }
    }
    if (this.dice === 5 && this.rolls.length === 0) return true
    if (this.dice === 0) {
      throw {
        message: "All dice have been rolled.",
        errorCode: DiceGameServiceErrorCodes.ALL_DICE_HAVE_BEEN_ROLLED
      }
    };
    if (this.dice === this.rolls[this.rolls.length - 1].length) {
      throw {
        message: "Pick at least one die.",
        errorCode: DiceGameServiceErrorCodes.DIE_NOT_PICKED
      }
    }
    return true;
  }


  async updateGameState() {
    let gameData = await getGameData();
    gameData = this.checkGameLeaders(gameData);

    // append latest roll to gameData
    gameData.players[this.activePlayer as string].rolls.push(this.rolls[this.rolls.length-1]);

    writeScores(gameData);
    broadcastScoreUpdate(gameData);
  }

  checkGameLeaders(gameData: GameDataModel) {
    let scores = gameData.players;
    // update lowest score
    let newLowest: GameDataModel['lowestScore'] = null;
    let newWinningPlayer: GameDataModel['winningPlayer'] = [];

    for (let player in scores) {
      let current = {
        score: scores[player].totalScore,
        player: player
      }
      console.log(current);
      if (newLowest === null) {
        console.log("newLowest does not exist");
        newLowest = current.score;
      }
      if (newLowest) { // shut up, TS
        if (gameData.lowestScore === null || current.score <= newLowest) {
          console.log('overwriting newLowest');
          if (current.score < newLowest) {
            newLowest = current.score;
            newWinningPlayer = [current.player];
          } else {
            // tied
            newLowest = current.score;
            newWinningPlayer.push(current.player);
          }
        }
      }
    }

    console.log(`Setting lowest Score to ${newLowest}`);
    console.log(`Setting winning player to ${newWinningPlayer}`);
    gameData.lowestScore = newLowest;

    if (this.activePlayer) { // purely to shut TS up. 
      gameData.winningPlayer = newWinningPlayer.length === 0 ? [this.activePlayer] : newWinningPlayer;
    } else {
      throw "No Active Player"
    }
    return gameData;
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
    //   console.log(allScores);
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
