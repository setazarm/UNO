import gameRoomSchema from '../models/gameRoomSchema.js'

export const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await gameRoomSchema.find()
        res.json({ success: true, data: rooms })
    } catch (error) {
        next(error)
    }
}