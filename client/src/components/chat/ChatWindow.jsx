import { useEffect, useRef, useState } from "react";

import api from "../../services/api";
import { createChatSocket } from "../../services/socket";

import "./ChatWindow.css";


function ChatWindow({ application, user, onClose }) {

    const applicationId = application?._id;

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [connected, setConnected] = useState(false);
    const [typingUser, setTypingUser] = useState(false);
    const [error, setError] = useState("");

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);


    /*
     * Scroll to the latest message
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };


    /*
     * Load previous messages from MongoDB
     */
    useEffect(() => {

        if (!applicationId) {
            return;
        }

        const loadMessages = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    `/messages/${applicationId}`
                );

                setMessages(
                    response.data.messages || []
                );

            } catch (err) {

                console.error(
                    "Failed to load messages:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load chat history."
                );

            } finally {

                setLoading(false);

            }
        };

        loadMessages();

    }, [applicationId]);


    /*
     * Create Socket.IO connection
     */
    useEffect(() => {

        if (!applicationId) {
            return;
        }

        const socket = createChatSocket();

        socketRef.current = socket;


        /*
         * Successfully connected
         */
        socket.on("connect", () => {

            console.log(
                "Socket connected:",
                socket.id
            );

            setConnected(true);
            setError("");


            /*
             * Join application room
             */
            socket.emit(
                "join_application",
                {
                    applicationId
                },
                (response) => {

                    if (!response?.ok) {

                        setError(
                            response?.message ||
                            "Unable to join chat."
                        );

                    }

                }
            );

        });


        /*
         * Socket disconnected
         */
        socket.on("disconnect", () => {

            console.log(
                "Socket disconnected"
            );

            setConnected(false);

        });


        /*
         * Connection error
         */
        socket.on("connect_error", (err) => {

            console.error(
                "Socket connection error:",
                err
            );

            setConnected(false);

            setError(
                err.message ||
                "Unable to connect to chat server."
            );

        });


        /*
         * Receive a new message
         */
        socket.on("new_message", (message) => {

            setMessages((previousMessages) => [
                ...previousMessages,
                message
            ]);

        });


        /*
         * Someone is typing
         */
        socket.on("typing", (data) => {

            if (
                data.applicationId === applicationId &&
                data.userId !== (user?._id || user?.id)
            ) {

                setTypingUser(
                    data.isTyping
                );

            }

        });


        /*
         * Connect after listeners
         * have been registered
         */
        socket.connect();


        /*
         * Cleanup
         */
        return () => {

            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("new_message");
            socket.off("typing");

            socket.disconnect();

            socketRef.current = null;

            if (typingTimeoutRef.current) {

                clearTimeout(
                    typingTimeoutRef.current
                );

            }

        };

    }, [
        applicationId,
        user?._id,
        user?.id
    ]);


    /*
     * Scroll whenever messages change
     */
    useEffect(() => {

        scrollToBottom();

    }, [messages, typingUser]);


    /*
     * Send a message
     */
    const sendMessage = (event) => {

        event.preventDefault();

        const text = messageText.trim();

        if (!text) {
            return;
        }

        if (!socketRef.current) {

            setError(
                "Chat connection is not available."
            );

            return;
        }

        if (!connected) {

            setError(
                "You are not connected to the chat."
            );

            return;
        }

        setSending(true);
        setError("");


        socketRef.current.emit(
            "send_message",
            {
                applicationId,
                text
            },
            (response) => {

                setSending(false);

                if (!response?.ok) {

                    setError(
                        response?.message ||
                        "Failed to send message."
                    );

                    return;
                }

                /*
                 * Do not add the message manually.
                 * Socket.IO sends new_message to everyone,
                 * including the sender.
                 */
                setMessageText("");

            }
        );

    };


    /*
     * Typing indicator
     */
    const handleTyping = (event) => {

        const value = event.target.value;

        setMessageText(value);

        if (!socketRef.current || !connected) {
            return;
        }

        socketRef.current.emit(
            "typing",
            {
                applicationId,
                isTyping: true
            }
        );


        /*
         * Stop typing after 800ms
         */
        if (typingTimeoutRef.current) {

            clearTimeout(
                typingTimeoutRef.current
            );

        }

        typingTimeoutRef.current = setTimeout(() => {

            socketRef.current?.emit(
                "typing",
                {
                    applicationId,
                    isTyping: false
                }
            );

        }, 800);

    };


    /*
     * Handle Enter key
     *
     * Enter       -> Send
     * Shift+Enter -> New line
     */
    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage(event);

        }

    };


    /*
     * Determine whether this message
     * belongs to the current user
     */
    const isMyMessage = (message) => {

        const currentUserId =
            user?._id || user?.id;

        const senderId =
            message.sender?._id ||
            message.sender?.id ||
            message.sender;

        if (!currentUserId || !senderId) {
            return false;
        }

        return (
            String(senderId) ===
            String(currentUserId)
        );

    };


    /*
     * Format message time
     */
    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    /*
     * Determine other person's name
     */
    const getOtherPersonName = () => {

        if (user?.role === "student") {

            return (
                application?.job?.recruiter?.name ||
                "Recruiter"
            );

        }

        return (
            application?.student?.name ||
            "Student"
        );

    };


    return (

        <div className="chat-window">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="chat-header">

                <div className="chat-header-info">

                    <h3>
                        Chat
                    </h3>

                    <span className="chat-person-name">
                        {getOtherPersonName()}
                    </span>

                </div>


                <div className="chat-header-actions">

                    <div className="chat-online-status">

                        <span
                            className={
                                connected
                                    ? "status-dot online"
                                    : "status-dot offline"
                            }
                        />

                        <span>
                            {connected
                                ? "Online"
                                : "Offline"
                            }
                        </span>

                    </div>


                    <button
                        type="button"
                        className="chat-close-button"
                        onClick={onClose}
                        aria-label="Close chat"
                    >
                        ×
                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="chat-error">
                    {error}
                </div>

            )}


            {/* =================================================
                MESSAGE AREA
            ================================================= */}

            <div className="chat-messages">

                {loading ? (

                    <div className="chat-loading">
                        Loading messages...
                    </div>

                ) : messages.length === 0 ? (

                    <div className="chat-empty">

                        <div className="chat-empty-icon">
                            💬
                        </div>

                        <p>
                            No messages yet.
                        </p>

                        <span>
                            Start the conversation.
                        </span>

                    </div>

                ) : (

                    messages.map((message) => {

                        const mine =
                            isMyMessage(message);

                        return (

                            <div
                                key={message._id}
                                className={
                                    mine
                                        ? "message-row mine"
                                        : "message-row"
                                }
                            >

                                <div
                                    className={
                                        mine
                                            ? "message-bubble mine"
                                            : "message-bubble"
                                    }
                                >

                                    {!mine && (

                                        <div className="message-sender">

                                            {message.sender?.name ||
                                                "User"}

                                        </div>

                                    )}


                                    <div className="message-text">
                                        {message.text}
                                    </div>


                                    <div className="message-time">

                                        {formatTime(
                                            message.createdAt
                                        )}

                                    </div>

                                </div>

                            </div>

                        );

                    })

                )}


                {/* Typing indicator */}

                {typingUser && (

                    <div className="typing-indicator">

                        <span />
                        <span />
                        <span />

                        <p>
                            {getOtherPersonName()} is typing...
                        </p>

                    </div>

                )}


                <div ref={messagesEndRef} />

            </div>


            {/* =================================================
                MESSAGE INPUT
            ================================================= */}

            <form
                className="chat-input-area"
                onSubmit={sendMessage}
            >

                <textarea
                    value={messageText}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        connected
                            ? "Type a message..."
                            : "Connecting..."
                    }
                    disabled={
                        !connected ||
                        sending
                    }
                    rows={1}
                    maxLength={2000}
                />


                <button
                    type="submit"
                    disabled={
                        !connected ||
                        !messageText.trim() ||
                        sending
                    }
                    className="chat-send-button"
                >

                    {sending
                        ? "..."
                        : "➤"
                    }

                </button>

            </form>

        </div>

    );

}

export default ChatWindow;