import { useEffect, useState, useContext } from "react";
import { MyContext } from "../context/context.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GameRoomCard from "./GameRoomCard.jsx";
import RoomPasswordModal from "./RoomPasswordModal.jsx";
import { socket } from "../socket.js";
import Container from "../context/Container.jsx";

const Lobby = () => {
    // const navigate = useNavigate();
    // const [passwordCorrect, setPasswordCorrect] = useState(false);
    // const [password, setPassword] = useState("");
    // const [show, setShow] = useState(false);
    // const [rooms, setRooms] = useState([]);

    // useEffect(() => {
    //     axios.get("http://localhost:8000/rooms").then((res) => {
    //         console.log(res.data.data);
    //         setRooms(res.data.data);
    //     });
    //     socket.on("delete_room", () => {
    //         console.log("delete_room triggered");
    //         axios.get("http://localhost:8000/rooms").then((res) => {
    //             console.log(res.data.data);
    //             setRooms(res.data.data);
    //         });
    //     });
    //     return () => {
    //         socket.off("delete_room");
    //         socket.disconnect();
    //     };
    // }, []);

    // return (
    //     <div>
    //         <>
    //             <div className="flex gap-4">
    //                 {rooms.map((room) => {
    //                     return (
    //                         <GameRoomCard
    //                             room={room}
    //                             key={room._id}
    //                             setShow={setShow}
    //                             setPassword={setPassword}
    //                             passwordCorrect={passwordCorrect}
    //                         />
    //                     );
    //                 })}
    //             </div>
    //             <button
    //                 onClick={() => {
    //                     navigate("/createRoom");
    //                 }}
    //                 className="border-2 border-black rounded p-1"
    //             >
    //                 Create a new Room
    //             </button>
    //         </>

    //         <RoomPasswordModal
    //             show={show}
    //             password={password}
    //             setPasswordCorrect={setPasswordCorrect}
    //             setShow={setShow}
    //         />
    //     </div>
    // );
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
                        navigate("/game/createroom");
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
