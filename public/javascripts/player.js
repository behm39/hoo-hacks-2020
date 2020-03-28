class Player {

    constructor(x, y, immobile = false) {
        Player.SWORD_LEN = 60;
        Player.R = 20;
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.angle = 0;
        this.aVel = 0;
        this.aAcc = 0;
        this.static = immobile;
        this.swordPrev = p5.Vector.fromAngle(this.angle);
        this.swordPrev.mult(Player.SWORD_LEN + Player.R);
        this.swordPrev.add(this.pos);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.swordPrev = p5.Vector.fromAngle(this.angle);
        this.swordPrev.mult(Player.SWORD_LEN + Player.R);
        this.swordPrev.add(this.pos);
        if (!this.static) {
            this._handleKeys();
            this._updateSword();
        }

        this.vel.add(this.acc);
        this.vel.limit(5);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.vel.mult(0.9);
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
        ellipse(this.pos.x, this.pos.y, Player.R * 2);
    }

    swordsHit(enemy) {
        let mySword = p5.Vector.fromAngle(this.angle);
        mySword.mult(Player.SWORD_LEN + Player.R);
        mySword.add(this.pos);

        let enemyPos = createVector(enemy.x, enemy.y);
        let theirSword = p5.Vector.fromAngle(enemy.angle);
        theirSword.mult(Player.SWORD_LEN + Player.R);
        theirSword.add(enemyPos);

        return lineSegmentIntersection(this.swordPrev, mySword, enemyPos, theirSword) ||
            lineSegmentIntersection(this.pos, mySword, enemyPos, theirSword);
    }

    swordHitMe(enemy) {
        let enemyPos = createVector(enemy.x, enemy.y);
        let theirSword = p5.Vector.fromAngle(enemy.angle);
        theirSword.mult(Player.SWORD_LEN + Player.R);
        theirSword.add(enemyPos);
        return lineSegmentCircleIntersection(theirSword, enemyPos, this.pos, Player.R);
    }

    _handleKeys() {
        const MOVE_FORCE = 0.25;
        if (keyIsDown('W'.charCodeAt(0))) {
            this.acc.add(createVector(0, -MOVE_FORCE));
        }
        if (keyIsDown('A'.charCodeAt(0))) {
            this.acc.add(createVector(-MOVE_FORCE, 0));
        }
        if (keyIsDown('S'.charCodeAt(0))) {
            this.acc.add(createVector(0, MOVE_FORCE));
        }
        if (keyIsDown('D'.charCodeAt(0))) {
            this.acc.add(createVector(MOVE_FORCE, 0));
        }
    }

    _updateSword() {
        let relativeMouse = createVector(mouseX, mouseY);
        relativeMouse.sub(this.pos);
        let desired = atan2(relativeMouse.y, relativeMouse.x) + TAU;

        if (abs(desired - this.angle) < abs(desired - (this.angle + TAU))) {
            desired -= this.angle;
        } else {
            desired -= this.angle + TAU;
        }

        desired = constrain(desired, -0.1, 0.1); // max speed

        let steer = desired - this.aVel;
        steer = constrain(steer, -0.005, 0.005); // max angular force

        this.aAcc += steer;

        this.aVel += this.aAcc;
        this.angle += this.aVel;
        while (this.angle < 0) {
            this.angle += TAU;
        }
        while (this.angle > TAU) {
            this.angle -= TAU;
        }
        this.aAcc = 0;
    }

}