import { useEffect, useContext } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/context";

const CreateRoom = () => {
    const { user } = useContext(MyContext);

    // const navigate = useNavigate();
    // const createRoom = (e) => {
    //     e.preventDefault();
    //     socket.connect(); // For when we connect clicking join
    //     socket.emit("createRoom", {
    //         roomName: e.target.room.value,
    //         password: e.target.password.value,
    //         player: JSON.parse(localStorage.getItem("user")),
    //     });
    // };

    // useEffect(() => {
    //     socket.on("room_created", (roomID) => {
    //         navigate(`/game/${roomID}`);
    //     });
    // }, []);

    // return (
    //     <form onSubmit={createRoom}>
    //         <input type="text" name="room" placeholder="Room name" />
    //         <input type="password" name="password" placeholder="password" />
    //         <button>Create a Room</button>
    //     </form>
    // );

    const createRoom = (e) => {
        e.preventDefault();
        socket.emit("create_room", {
            roomName: e.target.room.value,
            password: e.target.password.value,
            userId:user._id,
        });
    };

    return (
        <form onSubmit={createRoom}>
            <input type="text" name="room" placeholder="Room name" />
            <input type="password" name="password" placeholder="password" />
            <button>Create a Room</button>
        </form>
    );
};

export default CreateRoom;
