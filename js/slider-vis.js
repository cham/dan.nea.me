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
var blockcolours = [
    '#111',
    '#111',
    '#111',
    '#111',
    '#111',
    '#222',
    '#222',
    '#cc0',
    '#c00'
];

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

function moveSquare(){
    var col = Math.floor(Math.random() * Math.ceil(w / blocksize));
    var row = Math.floor(Math.random() * Math.ceil(h / blocksize));
    var startX = col * blocksize;
    var startY = row * blocksize;
    var copyData = ctx.getImageData(startX, startY, blocksize, blocksize);
    var frames = 10;
    var framesleft = 10;
    var moveBy = 0;
    var direction = Math.floor(Math.random() * 8);

    function doMove(){
        moveBy = Math.floor(((frames - framesleft) / frames) * blocksize);
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

draw();

function animloop(){
    requestAnimFrame(animloop);
    moveSquare();
}
requestAnimFrame(animloop);

window.onresize = function(){
    wSize = windowSize();
    w = wSize.width;
    h = documentHeight();
    canvas.width = w;
    canvas.height = h;
    draw();
};

document.body.appendChild(canvas);
