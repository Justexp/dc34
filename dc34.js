var Discord = require('discord.js');
var fs = require("fs");
var http = require('http');
var path = require('path');
var client = new Discord.Client();

var express = require('express');
var app = express();
var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'asd')));

server.listen(process.env.PORT);


var channel;
var reply;
var editable = false;
var map;
var mapjson;

function readJson(posX, posY) {
    fs.readFile('asd/map.json', function(err, data){
        if (err) throw err;
        map = JSON.parse(data);
        editable = true;
        console.log(map);
        modJson(posX, posY);
    });
}

function modJson(posX, posY){
    map.Hadean.x = posX;
    map.Hadean.y = posY;
    writeJson();

}

function writeJson(){
    mapjson = JSON.stringify(map, null, 4);
    fs.writeFile('asd/map.json', mapjson, 'utf8', function(){
        editable = false;
    })
}

client.loginWithToken('MjEwMjk4ODgxNDE2NjI2MTc2.CoMv5A.B09WVkLm3QSZ2-zoiLS6qQhmQ2c', output);

client.on('message', handleMessage);

function output (error, token) {
    if(error) {
        console.log(error);
    } else {
        console.log('Logged in. Token: ' + token);
    }
}

function handleMessage(message) {
    if(message.channel.isPrivate) {
        console.log('Private message | '+ message.author.name +' : '+ message.content);
    } else {
        console.log('('+ message.server.name +' / '+ message.channel.name +') '+ message.author.name +' : '+ message.content);

        //Message splitter
        var mainMessageArray = message.content.split(" ");

        //Check if message if a valid command
        if(mainMessageArray[0] === "/roll" || mainMessageArray[0] === "/hello" || mainMessageArray[0] === "/adv" || mainMessageArray[0] === "/dadv" || mainMessageArray[0] === "/move") {
            if(mainMessageArray[0] === "/move"){
                var moveMessageArray = mainMessageArray[1].split("/");
            } else {
                var diceAndModArray = mainMessageArray[1].split("+");
                var diceMessageArray = diceAndModArray[0].split("d");
            }

        }

        //Greet message handler
        if(message.content === "/hello"){
            channel = client.servers.get('name', message.server.name).channels.get('name', message.channel.name);
            reply = "Hello " + message.author + " !";
            client.sendMessage(channel, reply);
        }

        // Roll message handler
        if(mainMessageArray[0] === '/roll') {
            channel = client.servers.get('name', message.server.name).channels.get('name', message.channel.name);
            reply = rollReply(message.author, diceMessageArray[0], diceMessageArray[1], diceAndModArray[1]);
            client.sendMessage(channel, reply);
        }

        //Advantage message handler
        if(mainMessageArray[0] === "/adv"){
            channel = client.servers.get('name', message.server.name).channels.get('name', message.channel.name);
            reply = advReply(message.author, diceMessageArray[0], diceMessageArray[1], diceAndModArray[1]);
            client.sendMessage(channel, reply);
        }

        //Disadvantage message handler
        if(mainMessageArray[0] === "/dadv"){
            channel = client.servers.get('name', message.server.name).channels.get('name', message.channel.name);
            reply = dadvReply(message.author, diceMessageArray[0], diceMessageArray[1], diceAndModArray[1]);
            client.sendMessage(channel, reply);
        }

        //Move message handler
        if(mainMessageArray[0] === "/move"){
            var charName = message.author.name;
            var yPosition = moveMessageArray[0];
            var xPosition = moveMessageArray[1];
            readJson(xPosition, yPosition);
        }

    }
}

function rollDie(d) {
    return Math.floor(Math.random() * d + 1);
}

function rollReply(name, n, d, m) {
    var reply = name + " rolled: ";
    var sum = 0;
    var dieArray = [];
    var temp = 0;
    var intM = 0;
    if(n === "") {
        n = 1;
    }

    if(m === "" || m === undefined){
        m = 0;
    } else {
        intM = +m;
        m = intM;
    }
    for (var i = 0; i < n; i++) {
        dieArray.push(rollDie(d));
        reply += ":game_die:[" + dieArray[i] + "] ";
        sum += dieArray[i];
    }

    if(m > 0) {

     temp = sum + m;
     reply += " :part_alternation_mark:[+" + m + "]  :arrow_right:  " + temp;

    } else {

    }

    return reply;
}

function advReply(name, n, d, m) {

    var reply;
    var diceArray = [];
    var highest = 0;

    if(n !== 2){
        n = 2;
    }

    if(m === "" || m === undefined){
        m = 0;
    } else {
        m = +m;
    }

    reply = name + " rolled: ";

    for(var i = 0; i < n; i++) {
        diceArray.push(rollDie(d));
        reply += ":game_die:[" + diceArray[i] + "] ";
    }

    for(var j = 0; j < diceArray.length; j++) {
        if(diceArray[j] > highest) {
            highest = diceArray[j];
        }
    }

    if(m > 0) {
        reply += " :part_alternation_mark:[+" + m + "]  :arrow_right:  " + (highest + m);
    } else {
        reply += "  :arrow_right:  " + highest;
    }

    return reply;
}

function dadvReply(name, n, d, m){
    var reply;
    var diceArray = [];
    var lowest = 9999;

    if(n !== 2) {
        n = 2;
    }

    if(m === "" || m === undefined){
        m = 0;
    } else {
        m = +m;
    }

    reply = name + " rolled: ";

    for(var i = 0; i < n; i++) {
        diceArray.push(rollDie(d));
        reply += ":game_die:[" + diceArray[i] + "] "
    }

    for(var j = 0; j < diceArray.length; j++) {
        if(diceArray[j] < lowest){
            lowest = diceArray[j];
        }
    }

    if(m > 0){
        reply += " :part_alternation_mark:[+" + m + "]  :arrow_right: " + (lowest + m);
    } else {
        reply += "  :arrow_right:  " + lowest;
    }

    return reply;
}
