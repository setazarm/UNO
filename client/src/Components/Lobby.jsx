import { useNavigate } from "react-router-dom"

const Lobby = () => {
    const navigate = useNavigate()
  return (
    <div>Lobby
        <button onClick={()=>{
            navigate('/createRoom')

        }}>Create a new Room</button>
    </div>
  )
}

export default Lobby