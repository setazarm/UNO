import { Schema, model } from "mongoose";

const gameRoomSchema = new Schema(
    {
        roomName: {
            type: String,
            required: true,
            unique: true,
        },
        players: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        password: {
            type: String,
        },
        isFull: {
            type: Boolean,
            required: true,
            default: false,
        },
        userId:
        {type:Schema.Types.ObjectId, ref:"users"},
    },
    {
        timestamps: true,
    }
);

const GameRoom = model("GameRoom", gameRoomSchema);

export default GameRoom;
