import express from 'express';
import http from 'http';
import url from 'url';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import { CustomWS, GameDataModel, IPList, Player, WSMessageCommand } from './models';
import DiceGameService from './diceGame.service';
import { handleAddPlayer, handleChatMessage, handleGetScores, handleResetGame, handleRollDice, handleSetKeptDice, handleSubmitScore } from './handlers';
import { getGameData } from './database';

dotenv.config({
    path: '.env'
});

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(process.env.APP_PORT || 3069, function listening() {
    console.log('Listening on %d', (server?.address() as AddressInfo).port);
});

app.use((req, res) => {
    res.send({ msg: "hello" });
});

export const diceGameService = new DiceGameService();

app.get('/getScores', async (req, res, next) => {
    try {
        const allData: GameDataModel = await getGameData();
        res.send(allData);
    }
    catch (error) {
        logError(error);
    }
});

let IP_List: IPList[] = [];

wss.on('connection', (ws: CustomWS, req) => {
    // const location = url.parse(req.url || '', true);
    const ip = req.socket.remoteAddress;
    console.log("new connection: " + ip);

    if (ip) {
        IP_List.push({
            ip: ip,
        });
        ws.ip = ip;
    }

    ws.color = 'blue';
    console.log(IP_List);

    ws.onmessage = (message) => {
        // possible types of message are string | Buffer | ArrayBuffer | Buffer[]
        // But we'll only use string, so cast as string to shut TS up
        let msgObj = JSON.parse(message.data as string);
        console.log(msgObj);
        console.log(msgObj.command);
        console.log(`ws.player is: ${ws.player}`)
        switch (msgObj.command) {
            case WSMessageCommand.addPlayer:
                handleAddPlayer(msgObj, ws);
                break;
            // deprecated:
            // case WSMessageCommand.submitScore:
            //     handleSubmitScore(msgObj, ws);
            //     break;
            case WSMessageCommand.resetGame:
                handleResetGame();
                break;
            case WSMessageCommand.getScores:
                handleGetScores();
                break;
            case WSMessageCommand.chatMessage:
                handleChatMessage(msgObj, ws);
                break;
            case WSMessageCommand.rollDice:
                handleRollDice(msgObj, ws);
                break;
            case WSMessageCommand.setKeptDice:
                handleSetKeptDice(msgObj, ws);
                break;
        }
    };

    ws.onclose = () => {
        console.log(`Closed connection with ${ws.ip}`);
    }

    ws.onerror = (error: any) => {
        logError(error, ws);
    }
});

export function getScore(keptDice: Player['keptDice']) {
    let score = 0;
    try {
        for (let rollIndex in keptDice) {
            const roll = keptDice[rollIndex];
            for (let die in roll) {
                if (roll[die] != 3) {
                    score += roll[die];
                }
            }
        }
    }
    catch (error) {
        logError(error);
    }

    return score;
}

export function logError(error: any, ws?: CustomWS) {
    console.log(error);

    if (ws) {
        sendMessage({
            command: WSMessageCommand.error,
            message: error.message
        }, ws);
    }
}

export function sendMessage(payload: any, ws: CustomWS) {
    ws.send(JSON.stringify(payload));
}

export function broadcast(messageObject: any) {
    wss.clients.forEach((client) => {
        try {
            client.send(JSON.stringify(messageObject));
        }
        catch (error) {
            logError(error);
        }
    });
}

export function broadcastScoreUpdate(gameData: GameDataModel) {
    broadcast({
        command: WSMessageCommand.scoreUpdate,
        data: gameData,
    });
}

export function getIP(client: any) {
    return client?._socket?.remoteAddress;
}