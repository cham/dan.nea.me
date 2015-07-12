'use strict';

// shim layer with setTimeout fallback
var requestAnimFrame = (function(){
    function shim( callback ){
        window.setTimeout(callback, 1000 / 60);
    }
    return window.requestAnimationFrame || shim;
})();

function windowSize(){
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
}

function documentHeight(){
    var body = document.body;
    var html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

var wSize = windowSize();
var w = wSize.width;
var h = documentHeight();
var canvas = document.createElement('canvas');

canvas.width = w;
canvas.height = h;
canvas.className = 'slider-vis';

var ctx = canvas.getContext('2d');
var blocksize = 20;
var coloursets = [
    [
        '#111',
        '#111',
        '#111',
        '#111',
        '#111',
        '#222',
        '#222',
        '#cc0',
        '#c00'
    ],
    [
        '#111',
        '#111',
        '#111',
        '#111',
        '#111',
        '#222',
        '#222',
        '#c0c',
        '#cc0'
    ],
    [
        '#111',
        '#111',
        '#111',
        '#111',
        '#111',
        '#222',
        '#222',
        '#0cc',
        '#00c'
    ]
];
var blockcolours = coloursets[Math.floor(Math.random() * coloursets.length)];

function draw(){
    var numcols = Math.ceil(w / blocksize),
        numrows = Math.ceil(h / blocksize);

    for(var col = 0; col < numcols; col++){
        for(var row = 0; row < numrows; row++){
            ctx.fillStyle = blockcolours[Math.floor(Math.random() * blockcolours.length)];
            ctx.fillRect(col * blocksize, row * blocksize, blocksize, blocksize);
        }
    }
}

function moveSquare(options){
    options = options || {};

    var col = options.col || Math.floor(Math.random() * Math.ceil(w / blocksize));
    var row = options.row || Math.floor(Math.random() * Math.ceil(h / blocksize));
    var startX = options.x || col * blocksize;
    var startY = options.y || row * blocksize;
    var copyData = ctx.getImageData(startX, startY, blocksize, blocksize);
    var frames = options.numframes || 10;
    var framesleft = frames;
    var moveBy = 0;
    var direction = Math.floor(Math.random() * 8);
    var pixelsperframe = options.speed || 1;

    function doMove(){
        moveBy = Math.floor(((frames - framesleft) / frames) * blocksize * pixelsperframe);
        switch(direction){
        case 7:
            ctx.putImageData(copyData, startX + moveBy, startY);
            break;
        case 6:
            ctx.putImageData(copyData, startX - moveBy, startY);
            break;
        case 5:
            ctx.putImageData(copyData, startX, startY - moveBy);
            break;
        case 4:
            ctx.putImageData(copyData, startX, startY + moveBy);
            break;
        case 3:
            ctx.putImageData(copyData, startX + moveBy, startY + moveBy);
            break;
        case 2:
            ctx.putImageData(copyData, startX + moveBy, startY - moveBy);
            break;
        case 1:
            ctx.putImageData(copyData, startX - moveBy, startY - moveBy);
            break;
        default:
            ctx.putImageData(copyData, startX - moveBy, startY + moveBy);
            break;
        }
        if(framesleft>0){
            requestAnimFrame(doMove);
        }
        framesleft--;
    }
    doMove();
}

var mouseIsDown = false;
var lastTick = Date.now();
var debounceMs = 50;

function mouseDownCanvas(){
    mouseIsDown = true;
}

function mouseUpCanvas(){
    mouseIsDown = false;
}

function checkDebounce(){
    var now = Date.now();
    if(now - debounceMs < lastTick){
        return false;
    }
    lastTick = now;
    return true;
}

function fireSquares(x, y, times){
    for(var i = 0; i < times; i++){
        var speed = Math.ceil(Math.random() * 4);
        moveSquare({
            col: Math.floor(x / blocksize),
            row: Math.floor(y / blocksize),
            speed: speed,
            numframes: speed * 10
        });
    }
}

function mouseMoveCanvas(e){
    if(!mouseIsDown || !checkDebounce()){
        return;
    }
    fireSquares(e.pageX, e.pageY, 3);
}

function touchMoveCanvas(e){
    if(!checkDebounce()){
        return;
    }
    e.preventDefault();
    fireSquares(e.pageX, e.pageY, 3);
}

function animloop(){
    requestAnimFrame(animloop);
    moveSquare();
}

window.onresize = function(){
    wSize = windowSize();
    w = wSize.width;
    h = documentHeight();
    canvas.width = w;
    canvas.height = h;
    draw();
};

document.body.addEventListener('mousedown', mouseDownCanvas);
document.body.addEventListener('mouseup', mouseUpCanvas);
document.body.addEventListener('mousemove', mouseMoveCanvas);
document.body.addEventListener('touchmove', touchMoveCanvas);
document.body.appendChild(canvas);

draw();
requestAnimFrame(animloop);
