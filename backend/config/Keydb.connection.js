import Redis from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_TOKEN, // 'token' ki jagah yahan password ayega
  tls: {}, // Cloud Redis ke liye SSL/TLS lazmi hai
  maxRetriesPerRequest: null
});

connection.on("connect", () => {
  console.log("✅ Redis/KeyDB connected");
});

connection.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});
