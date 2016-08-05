var grid = 40;
var label;
var bg;
var timer = 0;
var playerNamesArray;
var playerArray = [];

function preload(){
    bg = loadImage("level1.jpg");
}

function setup () {
    createCanvas(1201,801);
}

function draw () {

    timer++;

    if(timer % 30 == 0){

        getData();
        image(bg, -25, -125)
        console.log(playerArray);

        for(var i = 0; i < height/grid; i++){
            for(var j = 0; j < width/grid; j++){
                fill('rgba(255, 255, 255, 0.7)');
                stroke('rgba(0, 0, 0, 0.1)')
                rect(j*grid, i*grid, grid, grid);
                fill('rgba(0, 0, 0, 0.7)');
                textSize(11);
                textAlign(LEFT);
                label = i + "/" + j;
                text(label, j*grid+4, i*grid+12);
            }
        }

        if(playerArray[playerArray.length-1] === undefined){

        }else{

            for(var i = 0; i < playerArray.length; i++){
                textSize(11);
                textAlign(CENTER);
                fill(playerArray[i].color);
                stroke('rgba(255, 255, 255, 0.6)');
                ellipse(20+playerArray[i].x*grid, 20+playerArray[i].y*grid, 10, 10);
                text(playerArray[i].charName, 20+playerArray[i].x*grid, 35+playerArray[i].y*grid);
            }
        }
    }
}

function getData(){
    loadJSON('map.json', setData);
}

function setData(ddata){
    playerNamesArray = ddata.names;
    for(var i = 0; i < playerNamesArray.length; i++){
        playerArray[i] = ddata[playerNamesArray[i]];
    }
}
