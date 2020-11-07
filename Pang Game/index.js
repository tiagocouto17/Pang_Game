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

const backgroundSound = new Audio('./sounds/background-sound.mp3');
const runSound = new Audio('./sounds/walk-sound.mp3');
const bounceSound = new Audio('./sound/bounce-sound.mp3');

let mouseClicked = false;

backImg.onload = function () {
    window.setInterval(renderCharacter, 1000 / 30);
}

let x1 = 0, x2 = W;
let rightKey = false, leftKey = false;
let mouseX = 0, mouseY = 0;



let frameIndex = 0;
let characterX = 200

function renderCharacter() {
    ctx.drawImage(backImg, 0, 0, W, H);
    ctx.drawImage(spriteImg, 0, frameIndex * 100, 100, 100, characterX, 400, 100, 100);
    backgroundSound.volume = 0.03;
    backgroundSound.play();

    // draw & update
    b.forEach(function (ball) {
        ball.draw();
        ball.update();
    });

    

    //character movement
    if (rightKey && characterX < W - 80) {
        runSound.play();
        frameIndex++;
        if (frameIndex >= 12) {
            frameIndex = 0;
        }
        characterX += 5;
    }
    if (leftKey && characterX > 0) {
        runSound.play();
        frameIndex++;
        if (frameIndex == 24 || frameIndex <= 12) {
            frameIndex = 12;
        }
        characterX -= 5;
    }
    if (mouseClicked == true) {
       
    a.forEach(function (arpon) {
        arpon.draw();
        arpon.update();
    });
    }
    mouseClicked = false; 
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
        frameIndex = 0;
        runSound.pause();
    }
    if (e.key == 'ArrowLeft') {
        leftKey = false;
        frameIndex = 12;
        runSound.pause();
    }
}

function MouseClick(e) {
    mouseClicked = true
}

canvas.addEventListener('click', e => {
    mouseClicked = true;
    console.log('s')
});

window.addEventListener('keydown', ArrowPressed);
window.addEventListener('keyup', ArrowReleased);
window.addEventListener('click', MouseClick);

// Balls functions
//CLASS
class Ball {
    constructor(x, y, r, d, c,a) {	// CONSTRUCTOR
        this.x = x; // initial X position
        this.y = y;	// initial Y position
        // (constant) horizontal displacement (velocity): d is a direction angle
        this.dX = 9 * Math.cos(-Math.PI / 3)
        // (constant) vertical displacement (velocity): d is a direction angle
        this.dY = 9 * Math.sin(-Math.PI / 3)
        this.c = c; // color
        this.R = r; // circle radius (constant)
        this.a = 0.4
    }

    draw() {
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.R, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        // check Canvas vertical collisions
        if (this.x < this.R || this.x > W - this.R) {
            this.dX = -this.dX;   
        }
            
        // check Canvas horizontal collisions
        if (this.y < this.R || this.y > H - this.R) {
            this.dY = -this.dY;
        } else {
            this.dY += this.a
        }
        
        this.x += this.dX;	// update horizontal position 
        this.y += this.dY;	// update vertical position 
    }
}


//setup as many balls as wanted
let b = new Array();
for (let i = 0; i < 1; i++) {
    let color = `yellow`;
    let xInit = W / 2;
    let yInit = 150;

    // random direction
    let direction = Math.random() * 2 * Math.PI;

    b.push(new Ball(xInit, yInit, 25, direction, color))
}

function render() {

    // draw & update
    b.forEach(function (ball) {
        ball.draw();
        ball.update();
    });

    //new frame
    window.requestAnimationFrame(render);
}

// render(); 

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
        if(this.topArponY >= 500){
            this.y-=500;
        } else if(this.topArponY <500){
            this.topArponY+=9;
        }

    }
}

let a = new Array();
for (let i = 0; i < 1; i++) {
    let color = `red`;

    a.push(new Arpon(characterX + 37, 450, color))
}