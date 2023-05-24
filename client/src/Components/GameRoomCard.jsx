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
        <div className="bg-white border border-gray-300 rounded-md p-4 mb-4 w-64">
        <h2 className="text-lg font-bold mb-2">{room.roomName}</h2>
        <h3 className="text-sm text-gray-600 mb-2">{room.players.length} / 4 Players</h3>
        <h3 className="text-sm text-gray-600 mb-2">
            Password Needed: {room.password ? "Yes" : "No"}
        </h3>
        <button
            disabled={disabled || room.isStarted}
            className={`px-4 py-2 rounded ${
                disabled ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={joinRoom}
        >
            {disabled ? "Full" : "Join"}
        </button>
        {room.isStarted ? (
            <p className="text-sm text-green-600 mt-2">Game Started</p>
        ) : (
            <p className="text-sm text-red-600 mt-2">Game Not Started</p>
        )}
    </div>
    );
};
export default GameRoomCard;
