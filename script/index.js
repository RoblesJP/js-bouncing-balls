var canvas, balls = [], ctx;
var colors = ["#f2a154", "#bbdfc8", "#ad6c80", "#c1a1d3", "#939b62"]



function init() {
    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 400;
    ctx = canvas.getContext('2d');

    for (i = 0; i < 3; i++) {
        let positionX = Math.random() * canvas.width;
        let positionY = Math.random() * canvas.height;
        let mass = 20;
        let velocityX = Math.random()*10 / mass;
        let velocityY = Math.random()*10 / mass;
        let radius = mass*2;
        let color = colors[Math.floor(Math.random() * colors.length)];

        balls.push(
            new Ball(
                positionX,   
                positionY,
                radius,                             
                velocityX,              
                velocityY,              
                mass,                                 
                color
            )             
        )
    }

    for (i = 0; i < 20; i++) {
        let positionX = Math.random() * canvas.width;
        let positionY = Math.random() * canvas.height;
        let mass = 1;
        let velocityX = Math.random() * 5;
        let velocityY = Math.random() * 5;
        let radius = mass*5;
        let color = colors[Math.floor(Math.random() * colors.length)];

        balls.push(
            new Ball(
                positionX,   
                positionY,
                radius,                             
                velocityX,              
                velocityY,              
                mass,                                 
                color
            )             
        )
    }

    /*var vb1 = new Ball(100, 100, 10, 1, 1, 5, "red");
    var vb2 = new Ball(200, 200, 10, -1, -1, 5, "blue");
    balls.push(vb1);
    balls.push(vb2);*/

    
}

function animation() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(e => {
        e.move(); 
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let b1 = balls[i];
            let b2 = balls[j];
            if (b1 != b2) {
                let dist = Math.sqrt(Math.pow(b2.positionX - b1.positionX, 2) + Math.pow(b2.positionY - b1.positionY, 2));
                if (dist < b1.radius + b2.radius) {
                
                    b1.ballCollision(b2);
                }
            }
        }
        
    }      

    balls.forEach(e => {
        e.show(); 
    });

    window.requestAnimationFrame(animation);
}

class Ball {
    constructor(positionX, positionY, radius, velocityX, velocityY, mass, color) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.mass = mass;
        this.color = color;
    }

    show() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    move() {
        this.wallCollision();
                
        // position update
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
    }

    scalarVelocity() {
        return Math.sqrt(Math.pow(this.velocityX, 2) + Math.pow(this.velocityY, 2));
    }

    movementAngle() {
        var angle = Math.atan2(this.velocityY, this.velocityX);
        //angle = angle < 0 ? angle + Math.PI * 2 : angle;
        return angle;
    }

    wallCollision() {
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
    }

    ballCollision(otherBall) {
        this.positionX -= this.velocityX;
        this.positionY -= this.velocityY;
        otherBall.positionX -= otherBall.velocityX;
        otherBall.positionY -= otherBall.velocityY;
        let contactAngle = Math.atan2(otherBall.positionY - this.positionY, otherBall.positionX - this.positionX);
        //contactAngle = contactAngle < 0 ? contactAngle + Math.PI*2 : contactAngle;
        let v1 = this.scalarVelocity();
        let v2 = otherBall.scalarVelocity();
        let m1 = this.mass;
        let m2 = otherBall.mass;
        let theta1 = this.movementAngle();
        let theta2 = otherBall.movementAngle();

        let vx1F = (v1 * Math.cos(theta1 - contactAngle) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - contactAngle)) / (m1 + m2) * Math.cos(contactAngle) + v1 * Math.sin(theta1 - contactAngle) * Math.cos(contactAngle + Math.PI / 2);
        let vy1F = (v1 * Math.cos(theta1 - contactAngle) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - contactAngle)) / (m1 + m2) * Math.sin(contactAngle) + v1 * Math.sin(theta1 - contactAngle) * Math.sin(contactAngle + Math.PI / 2);

        let vx2F = (v2 * Math.cos(theta2 - contactAngle) * (m2 - m1) + 2 * m2 * v1 * Math.cos(theta1 - contactAngle)) / (m2 + m1) * Math.cos(contactAngle) + v2 * Math.sin(theta2 - contactAngle) * Math.cos(contactAngle + Math.PI / 2);
        let vy2F = (v2 * Math.cos(theta2 - contactAngle) * (m2 - m1) + 2 * m2 * v1 * Math.cos(theta1 - contactAngle)) / (m2 + m1) * Math.sin(contactAngle) + v2 * Math.sin(theta2 - contactAngle) * Math.sin(contactAngle + Math.PI / 2);

        this.velocityX = vx1F;
        this.velocityY = vy1F;

        otherBall.velocityX = vx2F;
        otherBall.velocityY = vy2F;
    }
}

init();
window.requestAnimationFrame(animation);