const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const fs = require('fs');
const _ = require('lodash');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(3069, function listening() {
    console.log('Listening on %d', server.address().port);
});

var whiteList = [
    "http://web-who",
    "localhost"
];

app.use(function (req, res) {
    res.send({ msg: "hello" });
});

// var cors = require('cors');

// var corsOptions = {
//     origin: function (origin, callback) {
//         console.log('origin is %s', origin);
//         if (whiteList.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             console.log('origin %s not allowed by CORS', origin);
//             callback(new Error('Origin ' + origin + ' not allowed by CORS'));
//         }
//     }
// };
// app.use(cors(corsOptions));

// var root ="http://web-who/rnd/livemessenger/"
// var root ="localhost:3000/"
/*
var root = `localhost:${server.address().port}`
app.post(root + 'setColor', function() {
    console.log(req.body.color);
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    res.send(200).json({message: req.body.color});
    // get IP
}); */

app.get('/getScores', function (req, res, next) {
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

var IP_List = [];

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true);
    const ip = req.connection.remoteAddress;
    console.log("new connection: " + ip);
    // console.log(req.connection._peername);
    IP_List.push({
        ip: ip,
        color: 'red'
    });

    ws.color = 'blue';
    console.log(IP_List);

    ws.onmessage = function (message) {
        var msgObj = JSON.parse(message.data);
        console.log(msgObj);
        console.log(msgObj.command);
        switch (msgObj.command) {
            case "add_player":
                try {
                    // write the player to JSON file
                    let allData;
                    fs.readFile('scores.json', (err, data) => {
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

                            wss.clients.forEach(function each(client) {
                                try {
                                    client.send(JSON.stringify({
                                        command: "score_update",
                                        data: allData
                                    }));
                                }
                                catch (error) {
                                    logError(error);
                                }
                            });
                        }
                    });
                }
                catch (error) {
                    logError(error);
                }
                break;
            case "submit_score":
                /*  Store the score to json
                {
                    command: "submit_score",
                    user: "blah",
                    roll: rolls[rolls.length-1],
                    keptDice: keptDice
                }
                */

                // Check to make sure players haven't submitted too many dice

                try {
                    fs.readFile('scores.json', (err, data) => {
                        if (err) throw err;
                        let allData, scores;
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
                                let newLowest = null;
                                let newWinningPlayer = [];

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

                            wss.clients.forEach(function each(client) {
                                try {
                                    client.send(JSON.stringify({
                                        command: "score_update",
                                        data: allData,
                                    }));
                                }
                                catch (error) {
                                    logError(error);
                                }
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
                break;
            case "reset_game":
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
                break;
            case "get_scores":
                try {
                    // write the player to JSON file
                    let allData;
                    fs.readFile('scores.json', (err, data) => {
                        if (err) throw err;
                        allData = JSON.parse(data);

                        wss.clients.forEach(function each(client) {
                            try {
                                client.send(JSON.stringify({
                                    command: "score_update",
                                    data: allData
                                }));
                            }
                            catch (error) {
                                logError(error);
                            }
                        });
                    });

                }
                catch (error) {
                    logError(error);
                }
                break;
            case "chat_message":
                var messageIP = message.target._socket.remoteAddress;
                console.log("messageIP: " + messageIP);

                let sendUser = ws.user;
                // broadcast to those of similar IP
                wss.clients.forEach(function each(client) {
                    var clientIP = client._socket.remoteAddress;
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            command: "chat_message",
                            message: msgObj.message,
                            date: msgObj.date,
                            originIP: messageIP,
                            color: ws.color,
                            user: sendUser
                        }));
                    }
                });
                break;
            case "set_color":
                console.log("setting color");
                console.log(ws.color);
                ws.color = msgObj.color;
                console.log(ws.user);
                if (ws.user) {
                    let allData;
                    try {
                        fs.readFile('scores.json', (err, data) => {
                            if (err) throw err;
                            allData = JSON.parse(data);
                            allData.users[ws.user].color = ws.color || msgObj.color;

                            writeScores(allData);
                        });
                    }
                    catch (error) {
                        logError(error);
                    }
                }
                break;
        }
    };

    ws.onclose = function (close) {
        console.log("onclose");
    }
});

function writeScores(jsonObj) {
    try {
        fs.writeFileSync('scores.json', JSON.stringify(jsonObj));
    }
    catch (error) {
        logError(error);
    }
}

function getScore(keptDice) {

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

function logError(error) {
    console.log(error);
}
