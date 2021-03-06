let player;
let others;
let p;

let trees;

let swordClings;
let hurtSounds;
let socket;

const EDGE_X = 1000;
const EDGE_Y = 1000;

function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    swordClings = [];
    swordClings.push(loadSound('public/sounds/sword-cling-1.mp3'));
    swordClings.push(loadSound('public/sounds/sword-cling-2.mp3'));
    swordClings.push(loadSound('public/sounds/sword-cling-3.mp3'));
    swordClings.push(loadSound('public/sounds/sword-cling-4.mp3'));
    hurtSounds = [];
    hurtSounds.push(loadSound('public/sounds/hurt-1.wav'));
    hurtSounds.push(loadSound('public/sounds/hurt-2.wav'));

    socket = io();
}

function setup() {
    createCanvas(600, 600);
    player = new Player(random(-EDGE_X, EDGE_X), random(-EDGE_Y, EDGE_Y));
    others = [];
    socket.emit('start', { x: player.pos.x, y: player.pos.y, angle: player.angle });
    socket.on('heartbeat', (data) => {
        others = data;
    });
    trees = [];
    for (let i = 0; i < 100; i++) {
        trees.push({
            pos: createVector(random(-EDGE_X, EDGE_X), random(-EDGE_Y, EDGE_Y)),
            size: random(32, 64)
        });
    }
    p = createElement('p');
}

function draw() {
    update();
    render();
}

function update() {
    player.update();
    checkSwordCollision();
    checkDamageCollision();
    for (let i = 0; i < others.length; i++) {
        if (others[i].id != socket.id) {
            others[i].x += others[i].dx;
            others[i].y += others[i].dy;
            others[i].angle += others[i].da;
        }
    }
    socket.emit('update', {
        x: player.pos.x,
        y: player.pos.y,
        angle: player.angle,
        dx: player.vel.x,
        dy: player.vel.y,
        da: player.aVel,
        health: player.health,
        swordPrevX: player.swordPrev.x,
        swordPrevY: player.swordPrev.y
    });
}

function render() {
    background(71, 143, 76);

    stroke(0);
    strokeWeight(4);

    translate(width / 2, height / 2);
    translate(-player.pos.x, -player.pos.y);

    line(-EDGE_X, -EDGE_Y, EDGE_X, -EDGE_Y);
    line(EDGE_X, -EDGE_Y, EDGE_X, EDGE_Y);
    line(EDGE_X, EDGE_Y, -EDGE_X, EDGE_Y);
    line(-EDGE_X, EDGE_Y, -EDGE_X, -EDGE_Y);

    // line(player.pos.x, player.pos.y, mouseX, mouseY);


    let closestDistSq = Infinity;
    let closestIndex = 0;
    for (let i = 0; i < others.length; i++) {
        if (others[i].id != socket.id) {
            let dx = others[i].x - player.pos.x;
            let dy = others[i].y - player.pos.y;
            let dsq = dx * dx + dy * dy
            if (dsq < closestDistSq) {
                closestDistSq = dsq;
                closestIndex = i;
            }
            Player.Draw(others[i].angle, others[i].x, others[i].y, others[i].health); // TODO: other health
        }
    }
    if (others.length > 1 && closestDistSq > (width / 2) * (width / 2)) {
        player.drawArrowPointedAt(others[closestIndex]);
    }
    Player.Draw(player.angle, player.pos.x, player.pos.y, player.health);
    player.drawVelocityBar();
    drawTrees();
}

function drawTrees() {
    fill(35, 74, 37);
    for (let i = 0; i < trees.length; i++) {
        ellipse(trees[i].pos.x, trees[i].pos.y, trees[i].size, trees[i].size);
    }
}

function checkSwordCollision() {
    for (let i = 0; i < others.length; i++) {
        if (others[i].id != socket.id) {
            if (player.swordsHit(others[i])) {
                handleSwordCollision(others[i]);
            }
        }
    }
}

function checkDamageCollision() {
    for (let i = 0; i < others.length; i++) {
        if (others[i].id != socket.id) {
            if (player.swordHitMe(others[i])) {
                handleDamageCollision(others[i]);
            }
        }
    }
}

function handleSwordCollision(enemy) {
    let enemyPos = createVector(enemy.x, enemy.y);
    if (player.soundTimer < 0) {
        swordClings[floor(random(swordClings.length))].play();
        player.soundTimer = 30;
    }
    let bounce = p5.Vector.sub(enemyPos, player.pos);
    bounce.normalize();

    let theirSwordPrev = createVector(enemy.swordPrevX, enemy.swordPrevY);
    let theirSword = p5.Vector.fromAngle(enemy.angle);
    theirSword.mult(Player.SWORD_LEN + Player.R);
    theirSword.add(enemyPos);
    let theirSwordVel = p5.Vector.sub(theirSword, theirSwordPrev);

    let bounceMag = abs(player.aVel) + theirSwordVel.mag();

    bounce.mult(5 + bounceMag * 30); // tweak bounce mag
    bounce.mult(-1);
    player.applyForce(bounce);
}

function handleDamageCollision(enemy) {
    let enemyPos = createVector(enemy.x, enemy.y);
    let bounce = p5.Vector.sub(enemyPos, player.pos);
    bounce.normalize();

    bounce.mult(10);
    // enemy.applyForce(bounce);
    bounce.mult(-1);
    player.applyForce(bounce);

    let theirSwordPrev = createVector(enemy.swordPrevX, enemy.swordPrevY);
    let theirSword = p5.Vector.fromAngle(enemy.angle);
    theirSword.mult(Player.SWORD_LEN + Player.R);
    theirSword.add(enemyPos);
    let theirSwordVel = p5.Vector.sub(theirSword, theirSwordPrev);

    if (player.immunityFrames < 0) {
        hurtSounds[floor(random(hurtSounds.length))].play();
        let hurtAmt = map(theirSwordVel.mag(), 5, 25, 0.05, 0.60);
        hurtAmt = constrain(hurtAmt, 0.05, 0.60);
        player.health -= hurtAmt;
        player.immunityFrames = 30;
        if (player.health < 0) {
            handleDeath();
        }
    }
}

function handleDeath() {
    player = new Player(random(width), random(height));
}