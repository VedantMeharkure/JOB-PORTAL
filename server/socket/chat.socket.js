const jwt = require("jsonwebtoken");
const Message = require("../models/message");
const { getChatAccess } = require("../utils/chatAccess");

const CHAT_ROOM_PREFIX = "application:";

function getCookieValue(cookieHeader, name) {
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(";");

    for (const cookie of cookies) {
        const [key, ...valueParts] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }

    return null;
}

function roomName(applicationId) {
    return `${CHAT_ROOM_PREFIX}${applicationId}`;
}

function setupChatSocket(io) {
    // Authenticate Socket.IO connection using JWT cookie
    io.use((socket, next) => {
        try {
            const token = getCookieValue(
                socket.handshake.headers.cookie,
                "token"
            );

            if (!token) {
                return next(
                    new Error("Authentication required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;

            next();
        } catch (error) {
            next(
                new Error("Invalid or expired token")
            );
        }
    });

    io.on("connection", (socket) => {

        // ==========================================
        // JOIN APPLICATION CHAT
        // ==========================================

        socket.on(
            "join_application",
            async ({ applicationId } = {}, callback) => {
                try {
                    const access = await getChatAccess(
                        applicationId,
                        socket.user.id
                    );

                    if (!access.allowed) {
                        return callback?.({
                            ok: false,
                            message: access.message
                        });
                    }

                    const room = roomName(applicationId);

                    socket.join(room);

                    socket.data.applicationId = applicationId;

                    callback?.({
                        ok: true
                    });
                } catch (error) {
                    console.error(
                        "Socket join error:",
                        error
                    );

                    callback?.({
                        ok: false,
                        message: "Unable to join chat"
                    });
                }
            }
        );


        // ==========================================
        // SEND MESSAGE
        // ==========================================

        socket.on(
            "send_message",
            async (
                {
                    applicationId,
                    text
                } = {},
                callback
            ) => {
                try {
                    const messageText =
                        typeof text === "string"
                            ? text.trim()
                            : "";

                    if (!messageText) {
                        return callback?.({
                            ok: false,
                            message:
                                "Message cannot be empty"
                        });
                    }

                    if (messageText.length > 2000) {
                        return callback?.({
                            ok: false,
                            message:
                                "Message cannot exceed 2000 characters"
                        });
                    }

                    // Check whether the user is allowed
                    // to access this application chat
                    const access = await getChatAccess(
                        applicationId,
                        socket.user.id
                    );

                    if (!access.allowed) {
                        return callback?.({
                            ok: false,
                            message: access.message
                        });
                    }

                    const room = roomName(applicationId);

                    // Make sure the socket actually joined
                    // this application's chat room
                    if (!socket.rooms.has(room)) {
                        return callback?.({
                            ok: false,
                            message:
                                "Join the application chat before sending messages"
                        });
                    }

                    // Save message in MongoDB
                    const message = await Message.create({
                        application: applicationId,
                        sender: socket.user.id,
                        text: messageText
                    });

                    // Get sender information
                    const populatedMessage =
                        await Message
                            .findById(message._id)
                            .populate(
                                "sender",
                                "name role"
                            )
                            .lean();

                    // Send message to everyone
                    // inside this application room
                    io.to(room).emit(
                        "new_message",
                        populatedMessage
                    );

                    callback?.({
                        ok: true
                    });
                } catch (error) {
                    console.error(
                        "Socket send message error:",
                        error
                    );

                    callback?.({
                        ok: false,
                        message: "Failed to send message"
                    });
                }
            }
        );


        // ==========================================
        // TYPING INDICATOR
        // ==========================================

        socket.on(
            "typing",
            async (
                {
                    applicationId,
                    isTyping
                } = {}
            ) => {
                try {
                    const room = roomName(applicationId);

                    if (!socket.rooms.has(room)) {
                        return;
                    }

                    const access = await getChatAccess(
                        applicationId,
                        socket.user.id
                    );

                    if (!access.allowed) {
                        return;
                    }

                    socket.to(room).emit(
                        "typing",
                        {
                            applicationId,
                            userId: socket.user.id,
                            isTyping: Boolean(isTyping)
                        }
                    );
                } catch (error) {
                    console.error(
                        "Socket typing error:",
                        error
                    );
                }
            }
        );
    });
}

module.exports = setupChatSocket;