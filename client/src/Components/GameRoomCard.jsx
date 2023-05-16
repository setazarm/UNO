import { useEffect, useContext } from "react";
import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/context.js";

const GameRoomCard = ({ room }) => {
    const navigate = useNavigate();
    const { user } = useContext(MyContext);
    const { setPassword, setShow, passwordCorrect, setPasswordCorrect } = useContext(MyContext);
    const joinRoom = () => {
        if (!room.password) {
            socket.connect();
            socket.emit("join_room", { userId: user._id, roomId: room._id });
            navigate(`/game/${room._id}`);
        } else {
            setShow(true);
            setPassword(room.password);
        }
    };

    useEffect(() => {
        if (passwordCorrect) {
            socket.connect();
            socket.emit("join_room", { userId: user._id, roomId: room._id });
            setPassword("");
            setShow(false);
            setPasswordCorrect(false);
            navigate(`/game/${room._id}`);
        }
    }, [passwordCorrect]);

    const disabled = room.players.length >= 4;
    console.log("room", room.isStarted);
    return (
        <div className="border-gray-700 rounded-sm border-2 mb-1 w-32">
            <h2>{room.roomName}</h2>
            <h3>{room.players.length} / 4 Players</h3>
            <h3>Password needed: {room.password ? "Yes" : "No"}</h3>
            <button
                disabled={disabled || room.isStarted}
                className={"border-2 border-black rounded-md p-1"}
                onClick={joinRoom}
            >
                {disabled ? "Full" : "Join"}
            </button>
            {room.isStarted ? <p>Game started</p> : <p>Game not started</p>}
        </div>
    );
};
export default GameRoomCard;
