//Requiring modules
var Discord = require('discord.js');
var fs = require("fs");
var http = require('http');
var path = require('path');
var express = require('express');

//Creating new Discord client object
var client = new Discord.Client();

//Web server with express
var app = express();
var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'asd')));
server.listen(process.env.PORT);

//Declaring public variables
var channel;
var reply;
var map;
var mapjson;

//Bot log-in
client.loginWithToken('yourbotstokengoeshere', output);

function output (error, token) {
    if(error) {
        console.log(error);
    } else {
        console.log('Logged in. Token: ' + token);
    }
}

//Bot message handler
client.on('message', handleMessage);

function handleMessage(message) {
    if(message.channel.isPrivate) {
        console.log('Private message | '+ message.author.name +' : '+ message.content);
    } else {
        console.log('('+ message.server.name +' / '+ message.channel.name +') '+ message.author.name +' : '+ message.content);

        //Message splitter
        var mainMessageArray = message.content.split(" ");

        //Check if message if a valid command
        if(mainMessageArray[0] === "/roll" || mainMessageArray[0] === "/hello" || mainMessageArray[0] === "/adv" || mainMessageArray[0] === "/dadv" || mainMessageArray[0] === "/move" || mainMessageArray[0] === "/char") {

            //Get server and channel
            channel = client.servers.get('name', message.server.name).channels.get('name', message.channel.name);

            //Break down valid commands
            if(mainMessageArray[0] === "/move"){
                var moveMessageArray = mainMessageArray[1].split("/");
            } else if(mainMessageArray[0] === "/char"){
                var charMessageArray = mainMessageArray;
                console.log(charMessageArray[1]);
            }else {
                var diceAndModArray = mainMessageArray[1].split("+");
                var diceMessageArray = diceAndModArray[0].split("d");
            }


        }

        //Greet message handler
        if(message.content === "/hello"){
            reply = "Hello " + message.author + " !";
            client.sendMessage(channel, reply);
        }

        // Roll message handler
        if(mainMessageArray[0] === '/roll') {
            reply = rollReply(message.author, diceMessageArray[0], diceMessageArray[1], diceAndModArray[1], 'roll');
            client.sendMessage(channel, reply);
        }

        //Advantage message handler
        if(mainMessageArray[0] === "/adv"){
            reply = rollReply(message.author, diceMessageArray[0], diceMessageArray[1], diceAndModArray[1], 'adv');
            client.sendMessage(channel, reply);
        }

        //Disadvantage message handler
        if(mainMessageArray[0] === "/dadv"){
            reply = rollReply(message.author, diceMessageArray[0], diceMessageArray[1], diceAndModArray[1], 'dadv');
            client.sendMessage(channel, reply);
        }

        //Move message handler
        if((mainMessageArray[0] === "/move") && (map.names.indexOf(message.author.name) != -1)){
            var charName = message.author.name;
            var yPosition = moveMessageArray[0];
            var xPosition = moveMessageArray[1];
            console.log(charName);
            readJson(charName, xPosition, yPosition);
        }

        //Character message handler
        if((mainMessageArray[1] === "gold" || mainMessageArray[1] === "silver" || mainMessageArray[1] === "copper" || mainMessageArray[1] === "color" || mainMessageArray[1] === "name") && (map.names.indexOf(message.author.name) != -1)){
            console.log(map.names.indexOf(message.author.name));
            if(charMessageArray[2] === "add" || charMessageArray[2] === "sub"){
                 var charName = message.author.name;
                 var money = charMessageArray[1];
                 var op = charMessageArray[2];
                 var amnt = charMessageArray[3];
                 readJson(charName,null, null,null,null,money,op,amnt);
            } else if (charMessageArray[2] === "?"){
                console.log("YOYOYOY");
                client.sendMessage(channel, "You have: " + map[message.author.name].gold + " gold, " + map[message.author.name].silver + " silver, " + map[message.author.name].copper + " copper! ");
            } else if (mainMessageArray[1] === "color"){
                readJson(message.author.name, null, null, null, mainMessageArray[2], null, null, null);
            } else if (mainMessageArray[1] === "name"){
                readJson(message.author.name, null, null, mainMessageArray[2], null, null, null, null);
            }
        }

    }
}

//Functions called by message handler
function rollDie(d) {
    return Math.floor(Math.random() * d + 1);
}

function rollReply(name, n, d, m, type) {
    var reply = name + " rolled: ";
    var sum = 0;
    var diceArray = [];
    var temp = 0;
    var highest = 0;
    var lowest = 9999;

    //These types always roll 2 of the same dice
    if(type === "adv" || type === "dadv"){
        if(n !== 2){
            n = 2;
        }
    } else {
        if(n === "") {
            n = 1;
        }
    }

    //Modifier needs to be converter to and int
    if(m === "" || m === undefined){
        m = 0;
    } else {
        m = +m;
    }


    //Consturcting reply based on roll type
    if(type === "adv"){
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

    } else if(type === "dadv"){
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

    } else {
        for (var i = 0; i < n; i++) {
            diceArray.push(rollDie(d));
            reply += ":game_die:[" + diceArray[i] + "] ";
            sum += diceArray[i];
        }

        if(m > 0){
            temp = sum + m;
            reply += " :part_alternation_mark:[+" + m + "]  :arrow_right:  " + temp;
        }

        return reply;
    }

}

readJson();

//Reading JSON file and calling mod. function
function readJson(name, posX, posY, subName, color, money, op, amnt) {
    fs.readFile('asd/map.json', function(err, data){
        if (err) throw err;
        map = JSON.parse(data);
        console.log(map);
        modJson(name, posX, posY, subName, color, money, op, amnt);
    });
}

//Modifying the object created from the JSON file and calling write function
function modJson(name, posX, posY, subName, color, money, op, amnt){

    if(name === undefined || name === ""){

    } else {
        map[name].x = posX || map[name].x;
        map[name].y = posY || map[name].y;
        map[name].charName = subName || map[name].charName;
        map[name].color = color || map[name].color;
        if(op === "add"){
            var sssd = +map[name][money];
            var sssd2 = +amnt;
            map[name][money] = sssd+sssd2;
        } else if(op === "sub"){
            var sssd = +map[name][money];
            console.log(sssd);
            var sssd2 = +amnt;
            console.log(sssd2);
            map[name][money] = sssd-sssd2;
        }
        writeJson();
    }

}

//Converting the modified object back to JSON format and writing it to file
function writeJson(){
    mapjson = JSON.stringify(map, null, 4);
    fs.writeFile('asd/map.json', mapjson, 'utf8', function(){
    });
}
