function Player(id, x, y, angle) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle;
}

function setupSocketIO(io) {
    players = [];
    io.on('connection', (socket) => {
        console.log('user connected');

        /**
         * data: (x, y, angle)
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
    }, 33);
}




module.exports = setupSocketIO;