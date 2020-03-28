class Player {

    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.heading = 0;

        Player.SWORD_LEN = 60;
        Player.R = 40;
    }

    draw() {
        stroke(255);
        strokeWeight(4);
        let sword = p5.Vector.fromAngle(this.heading);
        sword.mult(Player.SWORD_LEN + Player.R);
        sword.add(this.pos);
        line(this.pos.x, this.pos.y, sword.x, sword.y);

        fill(201);
        stroke(0);
        ellipse(this.pos.x, this.pos.y, Player.R);
    }

}