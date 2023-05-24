import { useState, useContext } from "react";
import { MyContext } from "../context/context.js";
import { useNavigate } from "react-router-dom";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";

const Lobby = () => {
    const { rooms } = useContext(MyContext);
    const navigate = useNavigate();
    const divStyle = {
        '--u': '2.5vmin',
        '--c1': '#009688',
        '--c2': '#d8db24',
        '--pz': `calc(var(--u) * 0.65), rgba(255, 255, 255, 0.1) calc(calc(var(--u) * 0.65) + 1px)`,
        '--gp': `50%/calc(var(--u) * 10) calc(var(--u) * 10)`,
        height: '100vh',
        background: `
          radial-gradient(circle at 55% 25%, var(--c2) var(--pz)) var(--gp),
          radial-gradient(circle at 75% 45%, var(--c2) var(--pz)) var(--gp),
          radial-gradient(circle at 5% 75%, var(--c2) var(--pz)) var(--gp),
          radial-gradient(circle at 25% 55%, var(--c2) var(--pz)) var(--gp),
          radial-gradient(circle at 55% 75%, var(--c1) var(--pz)) var(--gp),
          radial-gradient(circle at 75% 95%, var(--c1) var(--pz)) var(--gp),
          radial-gradient(circle at 5% 25%, var(--c1) var(--pz)) var(--gp),
          radial-gradient(circle at 25% 5%, var(--c1) var(--pz)) var(--gp),
          conic-gradient(from 0deg at 50% 50%, var(--c1) 0 25%, var(--c2) 0 50%, var(--c1) 0 75%, var(--c2) 0 100%) var(--gp)`
      };
    return (
        <div className="flex flex-col items-center h-full py-10" style={divStyle}>
        <div className="flex flex-wrap justify-center gap-4">
            {rooms.map((room) => {
                return <GameRoomCard key={room._id} room={room} />;
            })}
        </div>
        <button
            onClick={() => {
                navigate("/createroom");
            }}
            className="mt-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
            Create a New Room
        </button>
    
        <RoomPasswordModal />
    </div>
    );
};

export default Lobby;
