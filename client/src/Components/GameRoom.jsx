import { useParams } from "react-router-dom";
import { socket } from "../socket.js";
import { useEffect, useState } from "react";

const GameRoom = () => {
    const location = useParams();
    const [roomData, setRoomData] = useState(null);

    const receiveMessage = (msg) => {
        console.log(msg);
    };

    useEffect(() => {
        socket.on("reply", receiveMessage);
        socket.on("room_data", (room) => {
            setRoomData(room);
        });
        return () => {
            socket.emit("leave_room"); // Logic trigger for removing player from DB
            socket.off("reply", receiveMessage);
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <div>
                <ul>
                    {roomData &&
                        roomData.players.map((player) => {
                            return <li>{player}</li>;
                        })}
                </ul>
            </div>
            <button onClick={() => socket.emit("test_event", "Testing...", location.id)}>
                Send message
            </button>
        </div>
    );
};

export default GameRoom;
