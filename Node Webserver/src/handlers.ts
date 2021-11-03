import { CustomWS, GameDataModel, ErrorCodes, WSMessageCommand, RollStatus } from './models';
import { diceGameService, logError, getScore, broadcast, sendMessage, getIP, broadcastScoreUpdate } from './index';
import { getGameData, writeScores } from './database';

export const handleAddPlayer = async (msgObj: any, ws: CustomWS) => {
  try {
    if (!msgObj.player) throw Error
    // write the player to JSON file
    let gameData: GameDataModel = await getGameData();

    if (!gameData.players[msgObj.player]) {
      // New player
      console.log(`setting ws.player: ${msgObj.player}`);
      ws.player = msgObj.player;
      ws.color = msgObj.color;
      gameData.players[msgObj.player] = {
        totalScore: 0,
        color: ws.color || 'blue',
        rolls: [],
        keptDice: [],
        rollStatus: RollStatus.NOT_ACTIVE
      }

      gameData.playerOrder.push(msgObj.player);

      if (!diceGameService.activePlayer) {
        // sets class property to active
        diceGameService.setActivePlayer(msgObj.player);
        gameData.activePlayer = msgObj.player;
        gameData.players[msgObj.player].rollStatus = RollStatus.AWAITING_ROLL;
      }

      writeScores(gameData);

      // this confirmation is to set flag on FE
      sendMessage({
        command: WSMessageCommand.addedPlayer,
        playerName: ws.player
      }, ws);

      broadcastScoreUpdate(gameData);
    } else if (ws.ip === getIP(ws)) {
      ws.player = msgObj.player;
      console.log(`Player already exists: ${ws.player}`);
      // Player already exists
      // this confirmation is to set flag on FE
      sendMessage({
        command: WSMessageCommand.addedPlayer,
        playerName: ws.player
      }, ws);
    } else {
      sendMessage({
        command: WSMessageCommand.error,
        message: "Player already exists. Use a different name.",
        code: ErrorCodes.ADD_PLAYER_FAILED
      }, ws);
    }
  } catch (error: any) {
    logError(error, ws);
  }
}

export const handleResetGame = () => {
  console.log("Resetting game.");
  diceGameService.resetGame();
  try {
    let newGame = {
      players: {},
      playerOrder: [],
      lowestScore: null,
      winningPlayer: [],
      activePlayer: null,
    };
    writeScores(newGame);
    broadcastScoreUpdate(newGame);
    broadcast({
      command: WSMessageCommand.resetGame
    })
  }
  catch (error) {
    logError(error);
  }
}

export const handleGetScores = async () => {
  try {
    const gameData: GameDataModel = await getGameData();
    broadcastScoreUpdate(gameData);
  }
  catch (error) {
    logError(error);
  }
}

export const handleSubmitScore = async (msgObj: any, ws: CustomWS) => {
  try {
    let gameData: GameDataModel = await getGameData();
    let scores;

    console.log(gameData);
    scores = gameData.players;
    console.log(scores);

    // add the scores
    if (scores[msgObj.player] === undefined) {
      try {
        scores[msgObj.player] = {
          totalScore: 0,
          rolls: [],
          keptDice: [],
          rollStatus: RollStatus.NOT_ACTIVE
        }

        ws.player = msgObj.player;
        console.log(`setting player: ${ws.player}`);

        gameData.playerOrder.push(msgObj.player);
      } catch (error) {
        logError(error);
      }
    }
    console.log(Object.keys(scores[msgObj.player].keptDice));
    if (Object.keys(scores[msgObj.player].keptDice).length < 5) {

      let score = getScore(msgObj.keptDice);
      scores[msgObj.player].rolls.push(msgObj.roll)
      scores[msgObj.player].keptDice = msgObj.keptDice;
      scores[msgObj.player].totalScore = score;
      scores[msgObj.player].color = ws.color;

      try {
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

        console.log(`Setting lowest Score to ${newLowest}`)
        console.log(`Setting winning player to ${newWinningPlayer}`)
        gameData.lowestScore = newLowest;
        gameData.winningPlayer = newWinningPlayer.length === 0 ? [msgObj.player] : newWinningPlayer;
      }
      catch (error) {
        logError(error);
      }

      gameData.players = scores;
      writeScores(gameData);

      broadcastScoreUpdate(gameData);
    } else {
      console.log("Too many dice.");
      sendMessage({
        command: "error",
        code: 0,
        message: "All dice have been rolled. Reset game to score again under this player."
      }, ws);
    }
  }
  catch (error) {
    logError(error);
  }
}

export const handleRollDice = async (msgObj: any, ws: CustomWS) => {
  // get the roll
  try {
    console.log(`handleRollDice - ws.player: ${ws.player}`)
    diceGameService.roll(ws.player);
  } catch (error) {
    logError(error, ws);
  }
}

export const handleSetKeptDice = async (msgObj: any, ws: CustomWS) => {
  try {
    console.log('handleSetKeptDice');
    diceGameService.setKeptDice(msgObj.keptDice);
  } catch (error) {
    logError(error, ws);
  }
}

export const handleChatMessage = (msgObj: any, ws: CustomWS) => {
  let sendPlayer = ws.player;
  broadcast({
    command: "chat_message",
    message: msgObj.message,
    date: msgObj.date,
    color: ws.color,
    player: sendPlayer
  });
}

export const handleSetColor = async (msgObj: any, ws: CustomWS) => {
  console.log("setting color");
  ws.color = msgObj.color;
  if (ws.player) {
    let gameData;
    try {
      let gameData: GameDataModel = await getGameData();
      gameData.players[ws.player].color = ws.color || msgObj.color;

      writeScores(gameData);
    }
    catch (error) {
      logError(error);
    }
  } else {
    console.log('set_color called with no player.');
  }
}