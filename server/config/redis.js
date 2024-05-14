const Redis = require("ioredis");

const redis = new Redis({
  port: 12567, // Redis port
  host: "redis-12567.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com", // Redis host
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
