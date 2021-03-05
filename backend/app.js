const PORT = 3000;

var express = require('express');

var app = express()

const redis = require('redis');
const client = redis.createClient({
  port: 6379
});

const http = require('http').Server(app);
const socket = require('socket.io')(http);

const subscribe = redis.createClient();
const publisher = redis.createClient();

http.listen(3000, () => {
  console.log("Express server listening on port %d", PORT)
});

app.get('/', (_, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/send', (req, res) => {
  if (req.query.msg)
    publisher.publish('chatting', req.query.msg)

  res.send(""), 200
})

subscribe.subscribe('chatting')
socket.on('connection', _ => {
  console.log("there is connected user")
  console.log(' %s sockets connected', socket.engine.clientsCount);
});

subscribe.on("message", (_, message) => {
  console.log
  socket.emit('message', message)
});

client.on('disconnect', () => {
  subscribe.quit();
});

client.on('error', (err) => {
  console.log(err);
});