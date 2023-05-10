import { useEffect, useState, useContext } from "react";
import { MyContext } from "../context/context.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";
import { socket } from "../socket.js";
import Container from "../context/Container.jsx";

const Lobby = () => {
    const { rooms } = useContext(MyContext);
    const navigate = useNavigate();
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    return (
        <div>
            <>
                <div className="flex gap-4">
                    {rooms.map((room) => {
                        return (
                            <GameRoomCard
                                room={room}
                                key={room._id}
                                setShow={setShow}
                                setPassword={setPassword}
                                passwordCorrect={passwordCorrect}
                            />
                        );
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

            <RoomPasswordModal
                show={show}
                password={password}
                setPasswordCorrect={setPasswordCorrect}
                setShow={setShow}
            />
        </div>
    );
};

export default Lobby;
