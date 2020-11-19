const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

//render random background image
let n = Math.floor(Math.random() * 5);
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

let ballArray = []


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



    //character movement
    if (rightKey && player1.dx < W - 80) {
        runSound.volume = 0.1;
        runSound.play();
        player1.sy += 100;
        if (player1.sy >= 1200) {
            player1.sy = 0;
        }
        player1.dx += 8;
    }
    if (leftKey && player1.dx > 0) {
        runSound.volume = 0.1;
        runSound.play();
        player1.sy += 100;
        if (player1.sy == 2400 || player1.sy <= 1200) {
            player1.sy = 1200;
        }
        player1.dx -= 8;
    }
    //Draw & update arpon
    if (mouseClicked == true) {

        a.forEach(function (arpon) {
            arpon.draw();
            arpon.update();
        });

    }
    ballArray.forEach(function (ball) {
        ball.draw();
        ball.update();
    });

    for (let i = 0; i < ballArray.length; i++) {
        const ball = ballArray[i];
        //colisions with player
        if (ball.sx + ball.w < player1.dx
            || ball.sx > player1.dx - 25 + player1.dw
            || ball.sy + ball.h < player1.dy
            || ball.sy > player1.dy + player1.dh) {
            colideWithPlayer = false;
        } else {
            colideWithPlayer = true
        }
        //Health system
        if (colideWithPlayer == true) {
            colideWithPlayerCount++;
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
        if (arpon1.x  < ball.sx
            || arpon1.x > ball.sx + ball.w
            || arpon1.y + 50 < (ball.sy - (ball.w / 2))
            || arpon1.topArponY > ball.sy + ball.h 
            ) {
        } else {
            alert('.')
            
            arpon1.y = -500;
            colideWithArpon = true
            ball.collisions++;
        }
        if (colideWithArpon == true && ball.collisions == 1) {
            ballDistance = 0
            ball.side= 'right'
            ball.w = 50
            ball.h = 50
            ball.borderW = 10
            ball.borderH = 20
            ball2 = new Ball(ballImg, 50,50,10,20,ball.sx,ball.sy,'left',1)
            ballArray.push(ball2)
            colideWithArpon = false;
        }
        if (colideWithArpon == true && ball.collisions == 2) {
            ball.side= 'right'
            ball.w = 20
            ball.h = 20
            ball.borderW = -10
            ball.borderH = 0
            ball3 = new Ball(ballImg, 20,20,-10,0,ball.sx,ball.sy,'left',2)
            ballArray.push(ball3)
            colideWithArpon = false;
        }
        if(colideWithArpon == true && ballon.collisions >= 3){
            ball.w = 0
            ball.h = 0
            ball.sx = -1000
            ball.sy = -1000
            colideWithArpon = false
        }
        // console.log(ball.collisions, colideWithArpon)
        // console.log(ballArray)
        // console.log(ball.sy , arpon1.y , arpon1.h1)
        console.log(arpon1.topArponY , (ball.sy + ball.h))
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

let arpon1;

function MouseClick(e) {
    mouseClicked = true
    PositionOnClick = player1.dx;
    arpon1 = new Arpon(PositionOnClick + 37, 450, 'red')

    if (a.length == 0 || a[a.length - 1].y < 0) {
        a.push(arpon1);
    }

}

window.addEventListener('keydown', ArrowPressed);
window.addEventListener('keyup', ArrowReleased);
window.addEventListener('click', MouseClick);

// CLASSES--------------------------------------------------------------
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
        this.topArponY = 20;
        this.w1 = 40;
        this.h1 = 490;
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
ballArray.push(ball1);