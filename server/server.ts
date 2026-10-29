import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import connectDB from "./utils/db";
import { initSocketServer } from "./socketServer";
require("dotenv").config();

const server = http.createServer(app);

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

// Initialize Socket.IO server and attach it to the HTTP server
initSocketServer(server);

const port = process.env.PORT || 8000;

// create server
server.listen(port, () => {
    console.log(`server is connected with port ${port}`);
    connectDB();
})