import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import userRouter from "./routes/user.js";
import roomRouter from "./routes/gameRoom.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import GameRoom from "./models/gameRoomSchema.js";
import User from "./models/userSchema.js";

import shuffleArray from "./shuffle.js";
import card from "./card.js";

import fileupload from "express-fileupload";

// Configure ENV variables
dotenv.config();

// Setup server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" },
});

// Middlewares
app.use(fileupload());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", exposedHeaders: ["token"] }));
app.use(errorHandler);

// Routes
app.use("/users", userRouter);
app.use("/rooms", roomRouter);

// DB Connection
mongoose
    .connect(
        process.env.URI,
        { useNewUrlParser: true, useUnifiedTopology: true },

        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Database connected! "))
    .catch((err) => console.log("Database is not connected! ", err.message));

io.on("connection", (socket) => {
    socket.on("user_connected", async ({ socketId, userId }) => {
        const user = await User.findByIdAndUpdate(userId, {
            socketId,
        });
    });
    // _________________________________________________________________

    //create new room
    socket.on("create_room", async ({ roomName, userId, password, bgColor }) => {
        try {
            const createdRoom = await GameRoom.create({ roomName, userId, password, bgColor });
        } catch (err) {
            io.to(socket.id).emit("error", err);
        }
        // send all room
        const rooms = await GameRoom.find().populate("players");
        io.emit("update_rooms", rooms);
    });

    //join room
    socket.on("join_room", async ({ userId, roomId }) => {
        const room = await GameRoom.findById(roomId);
        const user = await User.findById(userId);
        if (user) {
            user.room = roomId;
            if (!user.socketId) {
                user.socketId = socket.id;
            }
            await user.save();
        }
        if (room && !room.players.includes(userId)) {
            socket.join(room._id.toString());
            room.players.push(userId);
            await room.save();

            // send all updated rooms data
            const rooms = await GameRoom.find().populate("players");
            io.emit("update_rooms", rooms);
        }

        //starting game
        socket.on("start_game", async ({ roomId }) => {
            const cardDeck = shuffleArray(card);

            const room = await GameRoom.findById(roomId);
            let allUsersCards = [];

            for (let i = 0; i < room.players.length; i++) {
                let userCards = {
                    userId: room.players[i],
                    cards: cardDeck.slice(i * 7, (i + 1) * 7),
                    
                };
                allUsersCards.push(userCards);
            }

            const remainingCards = cardDeck.slice(room.players.length * 7);

            const updatedRoom = await GameRoom.findByIdAndUpdate(
                roomId,
                {
                    gameData: {
                        discardPile: [remainingCards[0]],
                        drawPile: remainingCards.slice(1),
                        isStarted: true,
                        allPlayerCards: allUsersCards,
                        turn: 0,
                    },
                },
                { new: true }
            ).populate("players");

            const rooms = await GameRoom.find().populate("players");

            io.in(roomId.toString()).emit("game_update", updatedRoom);

            // Updating Lobby
            io.emit("room_created", rooms);
        });
    });
    socket.on("update_game", async (room) => {
        const updatedRoom = await GameRoom.findByIdAndUpdate(
            room._id,
            {
                ...room,
            },
            { new: true }
        ).populate("players");

        io.in(room._id.toString()).emit("game_update", updatedRoom);
    });

    socket.on("draw_card", async ({ userId, room, num }) => {
        try {
            const updatedRoom = await GameRoom.findByIdAndUpdate(
                room._id,
                {
                    gameData: {
                        ...room.gameData,
                        allPlayerCards: room.gameData.allPlayerCards.map((player) => {
                            if (player.userId === userId) {
                                player.cards.push(...room.gameData.drawPile.slice(0, num));
                            }
                            return player;
                        }),
                        drawPile: room.gameData.drawPile.slice(num),
                    },
                },
                { new: true }
            ).populate("players");

            io.in(room._id.toString()).emit("game_update", updatedRoom);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("winner", ({ winner, roomId }) => {
        console.log(winner, "winner");
        io.in(roomId.toString()).emit("resultWinner", winner, roomId);
    });
    socket.on("leaveWinner", async ({ userId, roomId }) => {
        console.log("received leaveWinner", userId, roomId);
        const room = await GameRoom.findByIdAndUpdate(
            roomId,
            { $pull: { players: userId } },
            { new: true }
        );
        const user = await User.findByIdAndUpdate(
            userId,
            { $unset: { room: null } },
            { new: true }
        );
        io.in(roomId.toString()).emit("winnerLeft", room, user);
    });

    socket.on("playerCards-status", async (data) => {
        const user = await User.findById(data.userId);
        io.in(data.roomId.toString()).emit("cards", { user, card: data.length });
    });

    //leave room
    socket.on("leave_room", async ({ userId, roomId }) => {
        // Remove player from Room DB entry
        let room = await GameRoom.findById(roomId);
        if (room.players.includes(userId.toString())) {
            room = await GameRoom.findByIdAndUpdate(
                roomId,
                { $pull: { players: userId } },
                { new: true }
            );
            const user = await User.findByIdAndUpdate(userId, { $unset: { room: null } });
        }
        console.log(room.players);
        if (room.players.length === 0) {
            await GameRoom.findByIdAndDelete(roomId);
        }

        // Remove room from User DB entry
        socket.leave(roomId);

        // send all updated rooms data
        const rooms = await GameRoom.find().populate("players");
        io.emit("after_leave_room_created", rooms, userId);
    });

    // _____________________________________________________________________
    socket.on("disconnect", async () => {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
            const room = await GameRoom.findByIdAndUpdate(
                user.room,
                { $pull: { players: user._id } },
                { new: true }
            );
            user.socketId = null;
            user.room = null;
            await user.save();
        }

        // send all updated rooms data
        const rooms = await GameRoom.find().populate("players");
        io.emit("update_rooms", rooms);
    });
});

server.listen(8000, () => console.log(`The server is listening on port ${process.env.PORT}`));
