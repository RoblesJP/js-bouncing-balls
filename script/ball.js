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

    checkWallCollision() {
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

    resolveBallCollision(otherBall) {
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

    distanceTo(otherBall) {
        let dx = otherBall.positionX - this.positionX;
        let dy = otherBall.positionY - this.positionY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        return dist;
    }

    isOverlapping(otherBall) {
        if (this.distanceTo(otherBall) < this.radius + otherBall.radius) {
            return true;
        } else {
            return false;
        }
    }

    changePosition() {
        this.positionX = Math.random() * canvas.width;
        this.positionY = Math.random() * canvas.height
    }

    isOut() {
        if ((this.positionX - this.radius) < 0 || (this.positionX + this.radius) > canvas.width) {
            return true;
        }

        if ((this.positionY - this.radius) < 0 || (this.positionY + this.radius) > canvas.height) {
            return true;
        }

        return false;
    }
}