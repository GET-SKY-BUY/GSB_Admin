const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_DB = process.env.REDIS_DB;
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: REDIS_DB
});
client.on('error', (error) => {
    console.error(error);
});
client.on('connect', () => {
    console.log('Connected to Redis');
});
module.exports = client;
