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

// Configure ENV variables
dotenv.config();

// Setup server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173" },
});

// Middlewares
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
    // console.log(`a user connected ${socket.id}`);

    socket.on("user_connected", async ({ socketId, userId }) => {
        // console.log(userId, socketId);
        const user = await User.findByIdAndUpdate(userId, {
            socketId,
        });
    });
    // _________________________________________________________________

    //create new room
    socket.on("create_room", async ({ roomName, userId, password }) => {

        console.log("create_room");
        try {
            const createdRoom = await GameRoom.create({ roomName, userId, password });
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
        socket.on("start_game", async ({ userId, roomId, gameData }) => {
            // console.log("starting game", roomId);
            // console.log("gamedata", gameData);

            await GameRoom.findByIdAndUpdate(roomId, { isStarted: true }, { new: true });
            io.in(roomId.toString()).emit("game_started", gameData);
            const rooms = await GameRoom.find().populate("players");
            io.emit("room_created", rooms);
        });
    });
    socket.on("update_game", ({ userId, roomId, gameData }) => {
        // console.log("update game", roomId);
        // console.log("gamedata", gameData);
        io.in(roomId.toString()).emit("game_updated", gameData);
    });

    socket.on("winner", ({winner,roomId}) => {
        console.log(winner, 'winner');
        console.log(roomId);
        io.in(roomId.toString()).emit("resultWinner", winner,roomId);

    })
    socket.on("leaveWinner",async ({userId, roomId})=>{
    
      console.log("received leaveWinner",userId,roomId)
      const room= await GameRoom.findByIdAndUpdate(roomId,{$pull :{players: userId}},{new:true});
      const user = await User.findByIdAndUpdate(userId, { $unset: { room: null } },{new:true});
      io.in(roomId.toString()).emit("winnerLeft",room,user); 
    
    });  
       

    

        
    //leave room
    socket.on("leave_room", async ({ userId, roomId }) => {
        // console.log("leave", roomId, userId);

        // Remove player from Room DB entry
        const room1 = await GameRoom.findById(roomId)
        if(room1.players.includes(userId.toString())){
            const room = await GameRoom.findByIdAndUpdate(
                roomId,
                { $pull: { players: userId } },
                { new: true }
            );
            const user = await User.findByIdAndUpdate(userId, { $unset: { room: null } });
        }
       

        // Remove room from User DB entry
       
        socket.leave(roomId);

        if (room1.players.length === 0) {
            await GameRoom.findByIdAndDelete(roomId);
        }

        // send all updated rooms data
        const rooms = await GameRoom.find().populate("players");
        io.emit("after_leave_room_created", rooms, userId);
    });

    // _____________________________________________________________________
    socket.on("disconnect", async () => {
        // console.log(`user disconnected ${socket.id}`);

        const user = await User.findOne({ socketId: socket.id });
        //console.log(user);
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
