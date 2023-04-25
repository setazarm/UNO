import { Schema, model } from "mongoose"

const gameRoomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  gameStarted: {
    type: Boolean,
    default: false
  },
  gameEnded: {
    type: Boolean,
    default: false
  },
  isFull:{
    type:Boolean,
    required:true,
    default:false,
  }
}, {
  timestamps: true
});

const GameRoom = model('GameRoom', gameRoomSchema);

export default gameRoomSchema
