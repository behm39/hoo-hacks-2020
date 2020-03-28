let player;

function setup() {
    createCanvas(600, 600);
    player = new Player(width / 2, height / 2);
}

function draw() {
    update();
    render();
}

function update() {
    player.update();
}

function render() {
    background(201);

    // line(player.pos.x, player.pos.y, mouseX, mouseY);
    player.draw();
}