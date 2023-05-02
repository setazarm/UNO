import {socket} from  "../socket"

const CreateRoom = () => {
    
    const createRoom = (e) => {
        e.preventDefault()
        socket.emit('createRoom', {roomName: e.target.room.value, password: e.target.password.value})
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