let player;
let others;
let p;

let swordClings;
let socket;

const EDGE_X = 1000;
const EDGE_Y = 1000;

function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    swordClings = [];
    swordClings.push(loadSound('public/sounds/sword-cling-1.wav'));
    swordClings.push(loadSound('public/sounds/sword-cling-2.wav'));

    socket = io();
}

function setup() {
    createCanvas(600, 600);
    player = new Player(random(EDGE_X), random(EDGE_Y));
    others = [];
    socket.emit('start', { x: player.pos.x, y: player.pos.y, angle: player.angle });
    socket.on('heartbeat', (data) => {
        others = data;
    });
    p = createElement('p');
}

function draw() {
    update();
    render();
}

function update() {
    checkSwordCollision();
    checkDamageCollision();
    player.update();
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
        health: player.health
    });
}

function render() {
    background(201);

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

    let bounceMag = abs(player.aVel); // TODO: include enemy.aVel too

    bounce.mult(5 + bounceMag * 30); // tweak bounce mag
    // enemy.applyForce(bounce);
    bounce.mult(-1);
    player.applyForce(bounce);
}

function handleDamageCollision(enemy) {
    // TODO: play hurt sound
    let enemyPos = createVector(enemy.x, enemy.y);
    let bounce = p5.Vector.sub(enemyPos, player.pos);
    bounce.normalize();

    bounce.mult(10);
    // enemy.applyForce(bounce);
    bounce.mult(-1);
    player.applyForce(bounce);

    if (player.immunityFrames < 0) {
        player.health -= 0.35;
        player.immunityFrames = 30;
        if (player.health < 0) {
            handleDeath();
        }
    }
}

function handleDeath() {
    player = new Player(random(width), random(height));
}