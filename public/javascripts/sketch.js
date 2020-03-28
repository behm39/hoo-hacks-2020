let player;
let others;

let swordClings;

function preload() {
    soundFormats('mp3', 'ogg', 'wav');
    swordClings = [];
    swordClings.push(loadSound('public/sounds/sword-cling-1.wav'));
    swordClings.push(loadSound('public/sounds/sword-cling-2.wav'));
}

function setup() {
    createCanvas(600, 600);
    player = new Player(width * 0.75, height / 2);
    others = [];

    others.push(new Player(width / 4, height / 2, true));
}

function draw() {
    update();
    render();
}

function update() {
    player.update();
    for (let i = 0; i < others.length; i++) {
        others[i].update();
    }
    checkSwordCollision();
}

function render() {
    background(201);

    // line(player.pos.x, player.pos.y, mouseX, mouseY);
    player.draw();
    for (let i = 0; i < others.length; i++) {
        others[i].draw();
    }
}

function checkSwordCollision() {
    for (let i = 0; i < others.length; i++) {
        if (player.swordHit(others[i])) {
            handleSwordCollision(others[i]);
        }
    }
}

function handleSwordCollision(enemy) {
    swordClings[floor(random(swordClings.length))].play();
    let bounce = p5.Vector.sub(enemy.pos, player.pos);
    bounce.normalize();

    let bounceMag = abs(player.aVel) + abs(enemy.aVel);

    bounce.mult(bounceMag * 30); // tweak bounce mag
    enemy.applyForce(bounce);
    bounce.mult(-1);
    player.applyForce(bounce);
}