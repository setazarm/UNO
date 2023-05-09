import { useEffect } from "react";
import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";

const GameRoomCard = ({ room, setShow, setPassword, passwordCorrect }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const joinRoom = () => {

        if (!room.password) {
            socket.connect();
            navigate(`/game/${room._id}`);
        } else {
            setShow(true);
            setPassword(room.password);
        }

        
    };

    useEffect(() => {
        if (passwordCorrect) {
            socket.connect();
            navigate(`/game/${room._id}`);
        }
    }, [passwordCorrect]);

    const disabled = room.players.length >= 4;

    return (
        <div className="border-gray-700 rounded-sm border-2 mb-1 w-32">
            <h2>{room.roomName}</h2>
            <h3>{room.players.length} / 4 Players</h3>
            <h3>Password needed: {room.password ? "Yes" : "No"}</h3>
            <button
                disabled={disabled}
                className={"border-2 border-black rounded-md p-1"}
                onClick={joinRoom}
            >
                {disabled ? "Full" : "Join"}
            </button>
        </div>
    );
};
export default GameRoomCard;
