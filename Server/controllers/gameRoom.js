import gameRoomSchema from '../models/gameRoomSchema.js'

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await gameRoomSchema.find()
        res.json({ success: true, data: rooms })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}