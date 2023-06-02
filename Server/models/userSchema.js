import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        Avatar: {
            type: String,
            default: function () {
                return `https://ui-avatars.com/api/?name=${this.name}&background=random&color=fff&rounded=true&size=50`;
            },
        },
        points: {
            type: Number,
            default: 0,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
        status: {
            type: String,
        },
        numOfPlayedGames: {
            type: Number,
            default: 0,
            required: true,
        },
        socketId: { type: String },
        room: { type: Schema.Types.ObjectId, ref: "User" },

        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true, versionKey: false }
);

const User = model("User", userSchema);

export default User;
