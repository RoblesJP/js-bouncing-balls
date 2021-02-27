var canvas, balls = [], ctx;
var colors = ["#f2a154", "#bbdfc8", "#ad6c80", "#c1a1d3", "#939b62"]
var startTime = -1;
var animationLength = 999999;


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

function animation(timestamp) {
    var progress = 0;

    if (startTime < 0) {
        startTime = timestamp;
    } else {
        progress = timestamp - startTime;
    }
    
    

    balls.forEach(e => {
        e.move(); 
    });

    for (i = 0; i < balls.length; i++) {
        let b = balls[i];
        b.checkWallCollision();
    }

    for (i = 0; i < balls.length; i++) {
        for (j = i + 1; j < balls.length; j++) {
            let b1 = balls[i];
            let b2 = balls[j];
            if (b1.hasBallCollide(b2)) {
                b1.resolveBallCollision(b2);
            }
        }
    } 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    balls.forEach(e => {
        e.show(); 
    });

    if (progress < animationLength) {
        requestAnimationFrame(animation);
    }
}



init();
window.requestAnimationFrame(animation);