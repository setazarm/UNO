import GameRoom from "../models/gameRoomSchema.js";

export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await GameRoom.find();
        res.json({ success: true, data: rooms });
    } catch (error) {
        next(error);
    }
};