import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { allowedOrigins } from "./app";

let io: SocketIOServer;

export const initSocketServer = (server: http.Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: (requestOrigin, callback) => {
                if (!requestOrigin) return callback(null, true);
                if (allowedOrigins.indexOf(requestOrigin) !== -1 || allowedOrigins.includes("*")) {
                    callback(null, true);
                } else {
                    callback(new Error(`Origin ${requestOrigin} not allowed by Socket.IO CORS`));
                }
            },
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected");

        // Listen for notification event from the frontend
        socket.on("notification", (data) => {
            console.log("Received notification from client:", data);
            io.emit("newNotification", data);
        });

        socket.on("clientMessage", (data) => {
            console.log("Message from client:", data);
            socket.emit("serverMessage", "Hello from server!");
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};

export const getIO = () => io;