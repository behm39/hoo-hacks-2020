let player;
let others;

let swordClings;
let socket;

function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    swordClings = [];
    swordClings.push(loadSound('public/sounds/sword-cling-1.wav'));
    swordClings.push(loadSound('public/sounds/sword-cling-2.wav'));

    socket = io();
}

function setup() {
    createCanvas(600, 600);
    player = new Player(width * 0.75, height / 2);
    others = [];
    socket.emit('start', { x: player.pos.x, y: player.pos.y, angle: player.angle });
    socket.on('heartbeat', (data) => {
        others = data;
    });
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
        da: player.aVel
    });
}

function render() {
    background(201);

    // line(player.pos.x, player.pos.y, mouseX, mouseY);
    player.draw();
    for (let i = 0; i < others.length; i++) {
        if (others[i].id != socket.id) {

            stroke(255);
            strokeWeight(4);
            let sword = p5.Vector.fromAngle(others[i].angle);
            sword.mult(Player.SWORD_LEN + Player.R);
            sword.add(createVector(others[i].x, others[i].y));
            line(others[i].x, others[i].y, sword.x, sword.y);

            fill(201);
            stroke(0);
            ellipse(others[i].x, others[i].y, Player.R * 2);
        }
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
    swordClings[floor(random(swordClings.length))].play();
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
}