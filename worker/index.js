const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();
console.log("redisClient created.")

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  console.log("Calculating value for fib(" + message + ").");
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
console.log("redisClient subscribed.")