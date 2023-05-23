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
            bgColor: e.target["bg-color"].value,
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
            <select name="bg-color" id="bg-color">
                <option value="#f55142">Red</option>
                <option value="#428af5">Blue</option>
                <option value="#f5da42">Yellow</option>
                <option value="#07b825">Green</option>
                <option value="#010101">Black</option>
            </select>
            <button>Create a Room</button>
        </form>
    );
};

export default CreateRoom;
