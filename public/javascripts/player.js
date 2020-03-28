class Player {

    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.angle = 0;
        this.aVel = 0;
        this.aAcc = 0;

        Player.SWORD_LEN = 60;
        Player.R = 40;
    }

    update() {
        this._handleKeys();
        this._updateSword();
    }

    draw() {
        stroke(255);
        strokeWeight(4);
        let sword = p5.Vector.fromAngle(this.angle);
        sword.mult(Player.SWORD_LEN + Player.R);
        sword.add(this.pos);
        line(this.pos.x, this.pos.y, sword.x, sword.y);

        fill(201);
        stroke(0);
        ellipse(this.pos.x, this.pos.y, Player.R);
    }

    _handleKeys() {
        if (keyIsDown('W'.charCodeAt(0))) {
            this.pos.y += -2;
        }
        if (keyIsDown('A'.charCodeAt(0))) {
            this.pos.x += -2;
        }
        if (keyIsDown('S'.charCodeAt(0))) {
            this.pos.y += 2;
        }
        if (keyIsDown('D'.charCodeAt(0))) {
            this.pos.x += 2;
        }
    }

    _updateSword() {
        let relativeMouse = createVector(mouseX, mouseY);
        relativeMouse.sub(this.pos);
        let desired = atan2(relativeMouse.y, relativeMouse.x);
        if (abs(desired - this.angle) < abs(desired - (this.angle + TAU))) {
            desired -= this.angle;
        } else {
            desired -= this.angle + TAU;
        }

        desired = constrain(desired, -0.1, 0.1); // max speed

        let steer = desired - this.aVel;
        steer = constrain(steer, -0.01, 0.01); // max angular force

        this.aAcc += steer;

        this.aVel += this.aAcc;
        this.angle += this.aVel;
        this.aAcc = 0;
    }

}