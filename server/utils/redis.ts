import Redis from "ioredis";
require('dotenv').config();

const redisClient = () => {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
        const client = new Redis(redisUrl, {
            tls: {
                rejectUnauthorized: false, // Ensure Upstash TLS works without issues
            },
        });

        // Handle Redis connection events
        client.on("connect", () => {
            console.log("Redis connected successfully.");
        });

        client.on("error", (err) => {
            console.error("Redis connection error:", err);
        });

        return client;
    }
    throw new Error("Redis connection failed. Ensure REDIS_URL is set in your .env file.");
};

export const redis = redisClient();