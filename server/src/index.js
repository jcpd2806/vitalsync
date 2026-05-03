const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

redis.on('connect', () => console.log('✅ Redis connected'));

const PATIENT_IDS = ['P001', 'P002', 'P003', 'P004', 'P005'];

PATIENT_IDS.forEach((id) => {
  subscriber.subscribe(`vitals:${id}`, (err) => {
    if (err) console.error(`Failed to subscribe to vitals:${id}`, err);
    else console.log(`📻 Subscribed to vitals:${id}`);
  });
});

subscriber.on('message', (channel, message) => {
  const vitals = JSON.parse(message);
  io.emit('vitals', vitals);
  console.log(`📡 Emitted vitals for ${vitals.patientId}`);
});

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => res.json({ status: 'VitalSync alive ✅' }));

server.listen(3001, () => console.log('🚀 Server running on :3001'));

require('./simulator');