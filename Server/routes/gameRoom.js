import Router from 'express'
import {getAllRooms} from '../controllers/gameRoom.js'

const router = Router()

router.get('/', getAllRooms)

export default router