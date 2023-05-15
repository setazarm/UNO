import { useContext, useEffect } from "react";
import { socket } from "../socket";
import { MyContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
    const { user, rooms } = useContext(MyContext);
    const navigate = useNavigate();
    const createRoom = (e) => {
        e.preventDefault();
        socket.emit("create_room", {
            roomName: e.target.room.value,
            password: e.target.password.value,
            userId: user._id,
        });
    };

    useEffect(() => {
        const room = rooms.find((room) => {
            return room.userId.toString() === user._id.toString() ? room : null;
        });

        if (room) {
            socket.emit("join_room", { userId: user._id, roomId: room._id });
            navigate(`/game/${room._id}`);
        }
    }, [rooms]);

    return (
        <form onSubmit={createRoom}>
            <input type="text" name="room" placeholder="Room name" />
            <input type="password" name="password" placeholder="password" />
            <button>Create a Room</button>
        </form>
    );
};

export default CreateRoom;
