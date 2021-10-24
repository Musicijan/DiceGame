import fs from 'fs';
import { CustomWS, DataModel, ErrorCodes } from './models';
import { diceGameService, logError, getScore, writeScores, broadcast } from './index';

export const handleAddPlayer = (msgObj: any, ws: CustomWS) => {
  try {
    // write the player to JSON file
    let allData: DataModel;
    fs.readFile('scores.json', { encoding: 'utf8' }, (err, data) => {
      if (err) throw err;
      allData = JSON.parse(data);

      ws.user = msgObj.user;
      ws.color = msgObj.color;
      if (!allData.users[msgObj.user]) {
        allData.users[msgObj.user] = {
          totalScore: 0,
          color: ws.color || 'blue',
          rolls: [],
          keptDice: []
        }

        allData.playerOrder.push(msgObj.user);

        writeScores(allData);
        broadcast({
          command: "score_update",
          data: allData
        });
        // this confirmation is to set flag on FE
        ws.send(JSON.stringify({
          command: "added_player",
          userName: ws.user
        }));
      } else {
        ws.send(JSON.stringify({
          command: "add_player_failed",
          message: "Player already exists. Use a different name.",
          code: ErrorCodes.ADD_PLAYER_FAILED
        }))
      }
    });
  }
  catch (error) {
    logError(error);
  }
}

export const handleResetGame = () => {
  console.log("Resetting game.");
  try {
    let newGame = {
      users: {},
      playerOrder: [],
      lowestScore: null,
      winningPlayer: []
    };
    writeScores(newGame);
  }
  catch (error) {
    logError(error);
  }
}

export const handleGetScores = () => {
  try {
    // write the player to JSON file
    let allData: DataModel;
    fs.readFile('scores.json', { encoding: 'utf8' }, (err, data) => {
      if (err) throw err;
      allData = JSON.parse(data);
      broadcast({
        command: "score_update",
        data: allData
      });
    });

  }
  catch (error) {
    logError(error);
  }
}

export const handleSubmitScore = (msgObj: any, ws: CustomWS) => {
  try {
    fs.readFile('scores.json', { encoding: 'utf8' }, (err, data) => {
      if (err) throw err;
      let allData: DataModel, scores;
      allData = JSON.parse(data);
      console.log(allData);
      scores = allData.users;
      console.log(scores);


      // add the scores
      if (scores[msgObj.user] === undefined) {
        try {
          scores[msgObj.user] = {
            totalScore: 0,
            rolls: [],
            keptDice: []
          }

          ws.user = msgObj.user;

          allData.playerOrder.push(msgObj.user);
        } catch (error) {
          logError(error);
        }
      }
      console.log(Object.keys(scores[msgObj.user].keptDice));
      if (Object.keys(scores[msgObj.user].keptDice).length < 5) {

        let score = getScore(msgObj.keptDice);
        scores[msgObj.user].rolls.push(msgObj.roll)
        scores[msgObj.user].keptDice = msgObj.keptDice;
        scores[msgObj.user].totalScore = score;
        scores[msgObj.user].color = ws.color;

        try {
          // update lowest score
          let newLowest: DataModel['lowestScore'] = null;
          let newWinningPlayer: DataModel['winningPlayer'] = [];

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
            if (allData.lowestScore === null || current.score <= newLowest) {
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
          allData.lowestScore = newLowest;
          allData.winningPlayer = newWinningPlayer.length === 0 ? [msgObj.user] : newWinningPlayer;
        }
        catch (error) {
          logError(error);
        }

        allData.users = scores;
        writeScores(allData);

        broadcast({
          command: "score_update",
          data: allData,
        });
      } else {
        console.log("Too many dice.");
        ws.send(JSON.stringify({
          command: "error",
          code: 0,
          message: "All dice have been rolled. Reset game to score again under this user."
        }));
      }
    });
  }
  catch (error) {
    logError(error);
  }
}

export const handleChatMessage = (msgObj: any, ws: CustomWS) => {
  let sendUser = ws.user;
  broadcast({
    command: "chat_message",
    message: msgObj.message,
    date: msgObj.date,
    color: ws.color,
    user: sendUser
  });
}

export const handleSetColor = (msgObj: any, ws: CustomWS) => {
  console.log("setting color");
  ws.color = msgObj.color;
  if (ws.user) {
    let allData;
    try {
      fs.readFile('scores.json', { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        allData = JSON.parse(data);
        allData.users[ws.user].color = ws.color || msgObj.color;

        writeScores(allData);
      });
    }
    catch (error) {
      logError(error);
    }
  } else {
    console.log('set_color called with no user.');
  }
}