import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";

const Lobby = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8000/rooms").then((res) => {
            console.log(res.data.data);
            setRooms(res.data.data);
        });
    }, []);

    return (
        <div>
            <div className="flex gap-4">
                {rooms.map((room) => {
                    return <GameRoomCard room={room} key={room._id} setShow={setShow} />;
                })}
            </div>
            <RoomPasswordModal show={show} setShow={setShow} />
            <button
                onClick={() => {
                    navigate("/createRoom");
                }}
                className="border-2 border-black rounded p-1"
            >
                Create a new Room
            </button>
        </div>
    );
};

export default Lobby;
