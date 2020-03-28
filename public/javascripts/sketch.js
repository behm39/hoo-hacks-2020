let player;

function setup () {
    createCanvas(600, 600);
    player = new Player(width / 2, height / 2);
}

function draw() {
    background(201);

    player.draw();
}