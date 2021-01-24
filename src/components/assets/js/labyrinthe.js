import $ from 'jquery'

var canvas = $('#GameBoardCanvas');
//The game board 1 = walls, 0 = free space, and -1 = the goal
var board = [
    [ 1, 0, 1, 1, -2, 1, 1, 1, 1, 1],
    [ 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [ 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [ 1, 1, 1, 0, 0, 0, 1, 1, 0, -2],
    [ -2, 0, 1, 1, 1, 1, 1, 0, 0, 1],
    [ 1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
    [ 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [ 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [ 1, 1, 1, 1, 1, 1, 1, -1, 1, 1]
];
var player = {
    x: 1,
    y: 0
};

var wrongEnd = []

var end = {
    x: 0,
    y: 0,
}

//Draw the game board
function draw(){
    var width = canvas.width();
    var blockSize = width/board.length;
    var ctx = canvas[0].getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, width);
    ctx.fillStyle="white";
    for(var y = 0; y < board.length; y++){
        for(var x = 0; x < board[y].length; x++){
            if(board[y][x] === 1){
                ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
            }
            else if(board[y][x] === -1){
                // BONNE SORTIE
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = "gold";
                ctx.moveTo(x*blockSize, y*blockSize);
                ctx.lineTo((x+1)*blockSize, (y+1)*blockSize);
                ctx.moveTo(x*blockSize, (y+1)*blockSize);
                ctx.lineTo((x+1)*blockSize, y*blockSize);
                ctx.stroke();
                end.x = x;
                end.y = y;
            } else if(board[y][x] === -2){
                // MAUVAISE SORTIE
                let NewWrongEnd = [x, y];
                wrongEnd.push(NewWrongEnd);
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = "red";
                ctx.moveTo(x*blockSize, y*blockSize);
                ctx.lineTo((x+1)*blockSize, (y+1)*blockSize);
                ctx.moveTo(x*blockSize, (y+1)*blockSize);
                ctx.lineTo((x+1)*blockSize, y*blockSize);
                ctx.stroke();
            }
        }
    }
    ctx.beginPath();
    var half = blockSize/2;
    ctx.fillStyle = "blue";
    ctx.arc(player.x*blockSize+half, player.y*blockSize+half, half, 0, 2*Math.PI);
    ctx.fill();
}

function canMove(x, y){
    return (y>=0) && (y<board.length) && (x >= 0) && (x < board[y].length) && (board[y][x] != 1);
}

function isEnd(x, y){
    if (x == end.x && y == end.y){
        console.log('finished');
    };
    for(var i = 0; i<=wrongEnd.length; i++){
    }
}

$(document).keyup(function(e){
    if((e.which == 38) && canMove(player.x, player.y-1))//Up arrow
        player.y--;
    else if((e.which == 40) && canMove(player.x, player.y+1)) // down arrow
        player.y++;
    else if((e.which == 37) && canMove(player.x-1, player.y))
        player.x--;
    else if((e.which == 39) && canMove(player.x+1, player.y))
        player.x++;
    draw();
    e.preventDefault();
    isEnd(player.x, player.y);
});

draw();