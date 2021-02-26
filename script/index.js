var canvas, balls = [], ctx;



function init() {
    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 400;
    ctx = canvas.getContext('2d');
    for (i = 0; i < 1; i++) {
        balls.push(
            new Ball(
                Math.random() * canvas.width,   // positionX
                Math.random() * canvas.height,  // positionY
                10,                             // radius
                2,                              // velocityX
                -2                               // velocityY
            )             
        )
    };
    window.requestAnimationFrame(animation);
}

function animation() {
    
    window.requestAnimationFrame(() => this.animation());
    console.log(balls[0].movementAngle);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(e => {
        e.update();
        e.produce();
    });
}

class Ball {
    constructor(positionX, positionY, radius, velocityX, velocityY) {
        this.positionX = positionX;
        this.positionY= positionY;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.scalarVelocity = Math.sqrt(Math.pow(this.velocityX, 2) + Math.pow(this.velocityY, 2));
        this.movementAngle = Math.acos(this.velocityX / this.scalarVelocity);
    }

    produce = () => {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update = () => {

        // cieling bounce
        if (this.positionY - this.radius <= 0) {
            this.velocityY = -this.velocityY;
        }

        // floor bounce
        if (this.positionY + this.radius >= canvas.height) {
            this.velocityY = -this.velocityY;
        }

        // left wall bounce
        if (this.positionX - this.radius <= 0) {
            this.velocityX = -this.velocityX;
        }

        // right wall bounce
        if (this.positionX + this.radius >= canvas.width) {
            this.velocityX = -this.velocityX;
        }

        // position update
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
        this.movementAngle = Math.acos(this.velocityX / this.scalarVelocity);
    }
}

init();