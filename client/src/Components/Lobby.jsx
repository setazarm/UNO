import { useState, useContext } from "react";
import { MyContext } from "../context/context.js";
import { useNavigate } from "react-router-dom";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";
import{FaPlus} from "react-icons/fa";

const Lobby = () => {
    const { rooms } = useContext(MyContext);
    const navigate = useNavigate();
    // const divStyle = {
    //     '--u': '2.5vmin',
    //     '--c1': '#009688',
    //     '--c2': '#d8db24',
    //     '--pz': `calc(var(--u) * 0.65), rgba(255, 255, 255, 0.1) calc(calc(var(--u) * 0.65) + 1px)`,
    //     '--gp': `50%/calc(var(--u) * 10) calc(var(--u) * 10)`,
    //     height: '100vh',
    //     background: `
    //       radial-gradient(circle at 55% 25%, var(--c2) var(--pz)) var(--gp),
    //       radial-gradient(circle at 75% 45%, var(--c2) var(--pz)) var(--gp),
    //       radial-gradient(circle at 5% 75%, var(--c2) var(--pz)) var(--gp),
    //       radial-gradient(circle at 25% 55%, var(--c2) var(--pz)) var(--gp),
    //       radial-gradient(circle at 55% 75%, var(--c1) var(--pz)) var(--gp),
    //       radial-gradient(circle at 75% 95%, var(--c1) var(--pz)) var(--gp),
    //       radial-gradient(circle at 5% 25%, var(--c1) var(--pz)) var(--gp),
    //       radial-gradient(circle at 25% 5%, var(--c1) var(--pz)) var(--gp),
    //       conic-gradient(from 0deg at 50% 50%, var(--c1) 0 25%, var(--c2) 0 50%, var(--c1) 0 75%, var(--c2) 0 100%) var(--gp)`
    //   };
    const divStyle = {
        backgroundColor: '#C1EEB0',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%239cc88c' fill-opacity='0.6'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
      };
    
    return (
        <div className="flex flex-col items-center min-h-screen py-10" style={divStyle}>
        <div className="flex flex-wrap justify-center gap-4">
            {rooms.map((room) => {
                return <GameRoomCard key={room._id} room={room} />;
            })}
        </div>
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
