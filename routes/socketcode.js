function Player(id, x, y, angle) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.dx = 0;
    this.dy = 0;
    this.da = 0;
    this.health = 1;
}

function setupSocketIO(io) {
    players = [];
    io.on('connection', (socket) => {
        console.log('user connected');

        /**
         * data: (x, y, angle, dx, dy, da, health)
         */
        socket.on('start', (data) => {
            console.log(`player started: ${data}`);
            players.push(new Player(socket.id, data.x, data.y, data.angle));
        }); 

        socket.on('update', (data) => {
            for (let i = 0; i < players.length; i++) {
                if (players[i].id == socket.id) {
                    players[i].x = data.x;
                    players[i].y = data.y;
                    players[i].angle = data.angle;
                    players[i].dx = data.dx;
                    players[i].dy = data.dy;
                    players[i].da = data.da;
                    players[i].health = data.health;
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
            for (let i = players.length - 1; i >= 0; i--) {
                if (players[i].id == socket.id) {
                    players.splice(i, 1);
                    break;
                }
            }
        });
    });

    setInterval(() => {
        io.sockets.emit('heartbeat', players);
    }, 32);
}




module.exports = setupSocketIO;