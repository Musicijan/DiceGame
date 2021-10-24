import fs from 'fs';
import { logError } from '.';
import { GameDataModel } from './models';

export const getGameData = async (): Promise<GameDataModel> => {
  try {
    const results = await new Promise((resolve, reject) => {
      fs.readFile('scores.json', { encoding: 'utf8' }, (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    })
    console.log(results);
    return results as GameDataModel;
  } catch (err) {
    logError(err);
    throw err;
  }
}

export const writeScores = (jsonObj: GameDataModel) => {
  try {
    fs.writeFileSync('scores.json', JSON.stringify(jsonObj));
  }
  catch (error) {
    logError(error);
  }
}
