import express from 'express';
import http from 'http';
import url from 'url';
import WebSocket from 'ws';
import fs from 'fs';
import _ from 'lodash';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import { CustomWS, DataModel, IPList, User, WSMessageCommand } from './models';
import DiceGameService from './diceGame.service';
import { handleAddPlayer, handleChatMessage, handleGetScores, handleResetGame, handleSubmitScore } from './handlers';

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

app.get('/getScores', (req, res, next) => {
    try {

        fs.readFile('scores.json', (err, data) => {
            if (err) throw err;
            res.send(data);
        });
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
            color: 'red'
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
        switch (msgObj.command) {
            case WSMessageCommand.addPlayer:
                handleAddPlayer(msgObj, ws);
                break;
            case WSMessageCommand.submitScore:
                handleSubmitScore(msgObj, ws);
                break;
            case WSMessageCommand.resetGame:
                handleResetGame();
                break;
            case WSMessageCommand.getScores:
                handleGetScores();
                break;
            case WSMessageCommand.chatMessage:
                handleChatMessage(msgObj, ws);
                break;
        }
    };

    ws.onclose = (close) => {
        console.log("onclose");
    }
});

export function writeScores(jsonObj: DataModel) {
    try {
        fs.writeFileSync('scores.json', JSON.stringify(jsonObj));
    }
    catch (error) {
        logError(error);
    }
}

export function getScore(keptDice: User['keptDice']) {
    let score = 0;
    try {
        for (let die in keptDice) {
            if (keptDice[die] != 3) {
                score += keptDice[die];
            }
        }
    }
    catch (error) {
        logError(error);
    }

    return score;
}

export function logError(error: any) {
    console.log(error);
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

function getIP(client: any) {
    return client?._socket?.remoteAddress;
}