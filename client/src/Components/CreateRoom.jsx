import {socket} from  "../socket"
import { useNavigate } from "react-router-dom"
const CreateRoom = () => {
    const navigate = useNavigate()
    const createRoom = (e) => {
        e.preventDefault()
        socket.emit('createRoom', {roomName: e.target.room.value, password: e.target.password.value})
        navigate('/game')
        }
  return (
    <form onSubmit={createRoom}>
        <input type="text" name="room" placeholder="Room name"/>
        <input type="password" name="password" placeholder="password"/>
        <button>Create a Room</button>
    </form>
  )
}

export default CreateRoom