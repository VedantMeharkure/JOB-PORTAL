require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db.js");
const app = require("./app.js");
const setupChatSocket = require("./socket/chat.socket.js");

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

setupChatSocket(io);

connectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error starting server:", error);
        process.exit(1);
    });