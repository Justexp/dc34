var grid = 40;
var label;
var charPos;
var hadean;
var buky;
var bg;
var timer = 0;

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

        if(hadean === undefined || buky === undefined){

        }else{
            textSize(11);
            textAlign(CENTER);
            fill(200,0,0);
            stroke('rgba(255, 255, 255, 0.9)')
            ellipse(20+hadean.x*grid, 20+hadean.y*grid, 10, 10);
            text('Hadean', 20+hadean.x*grid, 35+hadean.y*grid)
            fill(0,0,200);
            ellipse(20+buky.x*grid, 20+buky.y*grid, 10, 10);
            text('Buky', 20+buky.x*grid, 35+buky.y*grid)
        }

    }


}

function getData(){
    loadJSON('map.json', setData);
}

function setData(ddata){
    charPos = ddata;
    hadean = charPos.Hadean;
    buky = charPos.Buky;
    console.log(hadean);
}
