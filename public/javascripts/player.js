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
        this.health = 1;
        this.immunityFrames = 0;
        this.soundTimer = 0;
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
        this._handleEdges();
        this.immunityFrames -= 1;
        this.soundTimer -= 1;

        // p.html(`Position: (${Math.trunc(this.pos.x / 10)}, ${Math.trunc(this.pos.y / 10)})`);
    }

    _handleEdges() {
        this.pos.x = constrain(this.pos.x, -EDGE_X, EDGE_X);
        this.pos.y = constrain(this.pos.y, -EDGE_Y, EDGE_Y);
    }   

    static Draw(angle, x, y, health) {
        push();
        translate(x, y);

        strokeWeight(2);
        fill(255, 0, 0);
        const HEALTH_W = 60;
        const HEALTH_Y_BUFFER = 20;
        rect(-HEALTH_W / 2, -Player.R - HEALTH_Y_BUFFER, HEALTH_W, 8);

        fill(0, 255, 0);
        let healthWidth = map(health, 0, 1, 0, HEALTH_W);
        healthWidth = constrain(healthWidth, 0, HEALTH_W);
        rect(-HEALTH_W / 2, -Player.R - HEALTH_Y_BUFFER, healthWidth, 8);

        stroke(255);
        strokeWeight(4);
        let sword = p5.Vector.fromAngle(angle);
        sword.mult(Player.SWORD_LEN + Player.R);
        line(0, 0, sword.x, sword.y);

        fill(201);
        stroke(0);
        ellipse(0, 0, Player.R * 2);
        pop();
    }

    drawVelocityBar() {
        push();
        translate(this.pos.x, this.pos.y);

        strokeWeight(2);
        fill(201);
        const BAR_W = 60;
        const BAR_Y_BUFFER = 12;
        rect(-BAR_W / 2, -Player.R - BAR_Y_BUFFER, BAR_W, 8);

        let sword = p5.Vector.fromAngle(this.angle);
        sword.mult(Player.SWORD_LEN + Player.R);
        sword.add(this.pos);
        let swordVel = p5.Vector.sub(sword, this.swordPrev);

        fill(0, 0, 255);
        let barWidth = map(swordVel.mag(), 0, 15, 0, BAR_W);
        barWidth = constrain(barWidth, 0, BAR_W);
        rect(-BAR_W / 2, -Player.R - BAR_Y_BUFFER, barWidth, 8);

        pop();
    }

    drawArrowPointedAt(enemy) {
        push();
        translate(this.pos.x, this.pos.y);

        console.log(enemy);
        
        let dx = enemy.x - this.pos.x;
        let dy = enemy.y - this.pos.y;
        let dirToEnemy = createVector(dx, dy);
        dirToEnemy.normalize();
        

        dirToEnemy.mult(100);
        stroke(255, 0, 0);
        strokeWeight(4);

        const ARROW_ANGLE = PI / 8;

        rotate(dirToEnemy.heading());
        line(0, 0, dirToEnemy.mag(), 0); // stalk of arrow
        translate(dirToEnemy.mag(), 0); // translate to tip of stalk
        push();
        rotate(PI - ARROW_ANGLE);
        line(0, 0, 20, 0);
        pop();
        rotate(PI + ARROW_ANGLE);
        line(0, 0, 20, 0);
        pop();
    }

    swordsHit(enemy) {
        let mySword = p5.Vector.fromAngle(this.angle);
        mySword.mult(Player.SWORD_LEN + Player.R);
        mySword.add(this.pos);

        let enemyPos = createVector(enemy.x, enemy.y);
        let theirSwordPrev = createVector(enemy.swordPrevX, enemy.swordPrevY);
        let theirSword = p5.Vector.fromAngle(enemy.angle);
        theirSword.mult(Player.SWORD_LEN + Player.R);
        theirSword.add(enemyPos);

        return lineSegmentIntersection(this.swordPrev, mySword, enemyPos, theirSword) ||
            lineSegmentIntersection(theirSwordPrev, theirSword, this.pos, mySword) ||
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
        let relativeMouse = createVector(mouseX - width / 2, mouseY - height / 2);
        // relativeMouse.sub(this.pos);
        let desired = atan2(relativeMouse.y, relativeMouse.x) + TAU;

        if (abs(desired - this.angle) < abs(desired - (this.angle + TAU))) {
            desired -= this.angle;
        } else {
            desired -= this.angle + TAU;
        }

        desired = constrain(desired, -0.15, 0.15); // max speed

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