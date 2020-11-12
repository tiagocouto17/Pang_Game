const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

//render random background image
let n = Math.floor(Math.random() * 6);
let randomImage = 'img/background-image' + n + '.jpg';

let backImg = new Image();
backImg.src = randomImage;

let borderImg = new Image();
borderImg.src = 'img/border-image2.jpg';

let spriteImg = new Image();
spriteImg.src = 'img/characterC.png';

let ballImg = new Image();
ballImg.src = 'img/ball.png';

let heartImg = new Image();
heartImg.src = 'img/heart.png'

let transparentImg = new Image();
transparentImg.src = 'img/transparente.png'

const backgroundSound = new Audio('./sounds/background-sound.mp3');
const runSound = new Audio('./sounds/walk-sound.mp3');
const bounceSound = new Audio('./sound/bounce-sound.mp3');

let mouseClicked = false;

backImg.onload = function () {
    window.setInterval(renderGame, 1000 / 30);
}

let x1 = 0, x2 = W;
let rightKey = false, leftKey = false;

let frameIndex = 0;
let characterX = 100

let colideWithPlayer = false;
let colideWithPlayerCount = 0;
let ballDistance = 40;

let colideWithArpon = false;

let heartText = 'X3'


function renderGame() {
    ctx.drawImage(backImg, 0, 0, W, H);
    ctx.drawImage(heartImg, 10, 10, 30, 30);
    ctx.beginPath();
    ctx.fillText(heartText, 45, 37);
    ctx.font = '35px Karmatic Arcade'
    backgroundSound.volume = 0.01;
    // backgroundSound.play();
    // draw & update ball
    player1.draw()

    // draw & update ball
    ball1.draw();
    ball1.update()

    //character movement
    if (rightKey && player1.dx < W - 80) {
        runSound.volume = 0.1;
        runSound.play();
        player1.sy += 100;
        if (player1.sy >= 1200) {
            player1.sy = 0;
        }
        player1.dx += 5;
    }
    if (leftKey && player1.dx > 0) {
        runSound.volume = 0.1;
        runSound.play();
        player1.sy += 100;
        if (player1.sy == 2400 || player1.sy <= 1200) {
            player1.sy = 1200;
        }
        player1.dx -= 5;
    }
    //Draw & update arpon
    if (mouseClicked == true) {

        a.forEach(function (arpon) {
            arpon.draw();
            arpon.update();
        });

    }
    //colisions with player
    if (ball1.sx + ball1.w < player1.dx
        || ball1.sx > player1.dx - 25 + player1.dw
        || ball1.sy + ball1.h < player1.dy
        || ball1.sy > player1.dy + player1.dh) {
        colideWithPlayer = false;
    } else {
        colideWithPlayer = true
    }
    //Health system
    if (colideWithPlayer == true) {
        colideWithPlayerCount++;
        console.log(colideWithPlayerCount)
    }
    if (colideWithPlayerCount > 0 && colideWithPlayerCount < 10) {
        heartText = 'X2'
    }
    if (colideWithPlayerCount >= 10 && colideWithPlayerCount < 20) {
        heartText = 'X1'
    }
    if (colideWithPlayerCount >= 20 && colideWithPlayerCount < 30) {
        heartText = 'X0'
    }

    //colisions with arpon
    if (ball1.sx + ball1.w - 20 < a.topArponX
        || ball1.sx - ball1.w + ballDistance > a.topArponX
        || ball1.sy + ball1.h - 30 < a.topArponY
        || ball1.sy > a.y + a.topArponY) {
        colideWithArpon = false;
    } else {
        colideWithArpon = true;
    }
    if (colideWithArpon == true) {
    }
}



function ArrowPressed(e) {
    if (e.key == 'ArrowRight') {
        rightKey = true;

    }
    if (e.key == 'ArrowLeft') {
        leftKey = true;

    }
    e.preventDefault()
}

function ArrowReleased(e) {
    if (e.key == 'ArrowRight') {
        rightKey = false;
        player1.sy = 0;
        runSound.pause();
    }
    if (e.key == 'ArrowLeft') {
        leftKey = false;
        player1.sy = 1200;
        runSound.pause();
    }
}

let PositionOnClick = 0;
let a = new Array();

function MouseClick(e) {
    mouseClicked = true
    PositionOnClick = player1.dx;

    if (a.length == 0 || a[a.length - 1].y < 0) {
        a.push(new Arpon(PositionOnClick + 37, 450, 'red'));
        //hasArpoon = true;
    }

}

window.addEventListener('keydown', ArrowPressed);
window.addEventListener('keyup', ArrowReleased);
window.addEventListener('click', MouseClick);

// CLASSES--------------------------------------------------------------
//CLASS
// class Ball {
//     constructor(x, y, r, z, c) {	// CONSTRUCTOR
//         this.x = x; // initial X position
//         this.y = y;	// initial Y position
//         // (constant) horizontal displacement (velocity): d is a direction angle
//         this.dX = 9 * Math.cos(-Math.PI / 3)
//         // (constant) vertical displacement (velocity): d is a direction angle
//         this.dY = 9 * Math.sin(-Math.PI / 3)
//         this.c = c; // color
//         this.R = r; // circle radius (constant)
//         this.a = 0.4
//     }

//     draw() {
//         ctx.fillStyle = this.c;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.R, 0, 2 * Math.PI);
//         ctx.fill();
//     }
//     update() {
//         // check Canvas vertical collisions
//         if (this.x < this.R || this.x > W - this.R) {
//             this.dX = -this.dX;
//         }

//         // check Canvas horizontal collisions
//         if (this.y < this.R || this.y > H - this.R) {
//             this.dY = -this.dY;
//         } else {
//             this.dY += this.a
//         }

//         this.x += this.dX;	// update horizontal position 
//         this.y += this.dY;	// update vertical position 
//     }
// }

// //setup as many balls as wanted
// let b = new Array();
//     let color = `yellow`;
//     let xInit = W / 2;
//     let yInit = 150;
//     let r = 25;

//     // random direction
//     let direction = Math.random() * 2 * Math.PI;

//     let ball1 = new Ball(xInit, yInit, r, direction, color)

class Ball {
    constructor(img, w, h, borderW, borderH, sx, sy, side, collisions) {
        this.img = img
        this.swidth = img.width / 2.65
        this.sheight = img.height / 3
        this.cx = 0
        this.cy = 0
        this.sx = sx
        this.sy = sy
        this.w = w
        this.h = h
        this.angle = -85 * Math.PI / 180
        this.a = 1.3		//acceleration (gravity = 0.1 pixels per frame)
        this.vX = 50 * Math.cos(this.angle) //initial velocity in X
        this.vY = 10 * Math.sin(this.angle) 	//initial velocity in Y
        this.borderW = borderW
        this.borderH = borderH
        this.collisions = collisions
        this.side = side
    }
    draw() {
        ctx.drawImage(this.img, this.cx, this.cy, this.swidth, this.sheight, this.sx, this.sy, this.w, this.h);
    }
    update() {
        if (this.sy > H - this.sheight - this.borderH) {
            this.vY = -this.vY
        } else {
            this.vY += this.a; // increase circle velocity in Y (accelerated motion)
        }
        if (this.sy < 0) {
            this.vY = -this.vY
        }
        if (this.sx > W - this.swidth - this.borderW) {
            this.side = 'left'
        }
        if (this.side == 'left') {
            this.sx -= this.vX; // update circle X position (uniform motion)
        }
        if (this.sx < 0 + 21) {
            this.side = 'right'
        }
        if (this.side == 'right') {
            this.sx += this.vX;
        }
        this.sy += this.vY; // update circle Y position 
    }
}


class Arpon {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.topArponX = 15;
        this.topArponY = 20
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 6
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.topArponX, this.y - (this.topArponY - 13));
        ctx.lineTo(this.x, (this.y - this.topArponY));
        ctx.lineTo(this.x - this.topArponX, this.y - (this.topArponY - 13));
        ctx.moveTo(this.x, (this.y - this.topArponY));
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
    update() {
        if (this.topArponY >= 500) {
            console.log(this.y, this.topArponY)
            this.y = -500;
        } else if (this.topArponY < 500) {
            this.topArponY += 9;
        }

    }
}

class Player {
    constructor(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.dx = dx;
        this.dy = dy;
        this.dw = dw;
        this.dh = dh;
    }
    draw() {
        ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
    }
}

let player1 = new Player(spriteImg, 0, frameIndex * 100, 100, 100, characterX, 400, 100, 100)

let ball1 = new Ball(ballImg, 100, 100, 60, 80, 100, 100, 'right', 0, 100, 100)