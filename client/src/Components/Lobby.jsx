import { useState, useContext } from "react";
import { MyContext } from "../context/context.js";
import { useNavigate } from "react-router-dom";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";
import { FaPlus } from "react-icons/fa";

const Lobby = () => {
    const { rooms } = useContext(MyContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const filteredRooms = rooms.filter((room) =>
        room.roomName.toLowerCase().includes(search.toLowerCase())
    );

    const divStyle = {
        backgroundColor: "#C1EEB0",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%239cc88c' fill-opacity='0.6'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
    };

    return (
        <div className="flex flex-col items-center min-h-screen py-10" style={divStyle}>
            <div className="max-w-md mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-cyan-900 text-white focus:outline-none"
                />
            </div>

            {filteredRooms.length > 0 ? (
                <div className="flex gap-4">
                    {filteredRooms.map((room) => (
                        <GameRoomCard key={room._id} room={room} />
                    ))}
                </div>
            ) : (
                <div className="text-2xl text-gray-700 bg-[#b6d6bf] p-3">No rooms found</div>
            )}
            <button
                onClick={() => {
                    navigate("/createroom");
                }}
                className="mt-4 flex justify-center items-center gap-3 px-4 py-2 rounded bg-green-900 text-white hover:bg-green-600"
            >
                Create a New Room <FaPlus />
            </button>

            <RoomPasswordModal />
        </div>
    );
};

export default Lobby;
