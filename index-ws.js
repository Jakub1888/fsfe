const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => { console.log('Server started on port 3000'); });

/** Websockets */
const WebsocketServer = require('ws').Server;

const wss = new WebsocketServer({ server: server });

wss.on('connection', (ws) => {
    const numClients = wss.clients.size;
    console.log('Clients connected', numClients);

    wss.broadcast(`Current visitos: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    ws.on('close', () => {
        wss.broadcast(`Current visitos: ${numClients}`);

        console.log('A client has disconnected')
    })
});

wss.broadcast = (data) => {
    wss.clients.forEach(client => {
        client.send(data);
    });
}