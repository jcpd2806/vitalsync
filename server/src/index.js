const express = require('express');

const app = express();

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

app.get('/', (req, res) => res.json({ status: 'VitalSync alive ' }));

app.listen(3001, () => console.log('🚀 Server running on :3001'));

require('./simulator');