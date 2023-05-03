import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";
import { socket } from "../socket.js";

const Lobby = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [socketConnect, setSocketConnect] = useState(false);
    useEffect(() => {
        axios.get("http://localhost:8000/rooms").then((res) => {
            console.log(res.data.data);
            setRooms(res.data.data);
        });
    }, []);

    return (
        <div>
            {socketConnect ? (
                <>
                    <div className="flex gap-4">
                        {rooms.map((room) => {
                            return <GameRoomCard room={room} key={room._id} setShow={setShow} />;
                        })}
                    </div>
                    <button
                        onClick={() => {
                            navigate("/createRoom");
                        }}
                        className="border-2 border-black rounded p-1"
                    >
                        Create a new Room
                    </button>
                    <button
                        onClick={() => {
                            socket.disconnect();
                            setSocketConnect(false);
                        }}
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <div>
                    <button
                        onClick={() => {
                            socket.connect();
                            setSocketConnect(true);
                        }}
                    >
                        Connect to lobby
                    </button>
                </div>
            )}

            <RoomPasswordModal show={show} setShow={setShow} />
        </div>
    );
};

export default Lobby;
