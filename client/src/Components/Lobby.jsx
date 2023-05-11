import { useState, useContext } from "react";
import { MyContext } from "../context/context.js";
import { useNavigate } from "react-router-dom";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";

const Lobby = () => {
    const { rooms } = useContext(MyContext);
    const navigate = useNavigate();

    return (
        <div>
            <>
                <div className="flex gap-4">
                    {rooms.map((room) => {
                        return <GameRoomCard key={room._id} room={room} />;
                    })}
                </div>
                <button
                    onClick={() => {
                        navigate("/createroom");
                    }}
                    className="border-2 border-black rounded p-1"
                >
                    Create a new Room
                </button>
            </>

            <RoomPasswordModal />
        </div>
    );
};

export default Lobby;
