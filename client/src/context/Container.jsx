import { useEffect, useState } from "react";
import { MyContext } from "./context.js";
import { socket } from "../socket.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Container({ children }) {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [isUno, setIsUno] = useState(false);

    const [color, setColor] = useState("");

    const [winner, setWinner] = useState(null);

    const navigate = useNavigate();

    // Room password checking
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        const allRooms = (rooms) => {
            setRooms(rooms);
        };

        const updateRoom = (room) => {
            setRoom((previousRoom) => {
                return room;
            });
        };

        const afterLeave = (rooms, userId) => {
            setUser((user) => {
                if (user._id.toString() === userId) {
                    setRoom(null);
                    setRooms(rooms);
                    navigate("/lobby");
                    return user;
                } else {
                    setRooms(rooms);
                    return user;
                }
            });
        };

        const errorHandler = (error) => {
            console.log(error);
            switch (error.code) {
                case 11000:
                    alert("Room name already in use ");
                    break;
                default:
                    if (error.message) {
                        alert(`${error.message}`);
                    } else {
                        alert("An error ocurred");
                    }
                    break;
            }
        };

        const alarmWinner = (winner, roomId) => {
            console.log(`winner is ${winner.name}`);
            setUser((user) => {
                if (user._id.toString() === winner._id.toString()) {
                    setWinner(winner);
                    socket.emit("leaveWinner", {
                        roomId,
                        userId: user._id,
                    });
                }
                return user;
            });
        };
        const winnerLeftRoom = (room, winUser) => {
            console.log(room, winUser);

            setRoom(room);
            // setTurn((pre) => {
            //     if (pre === room.players.length - 1) {
            //         return 0;
            //     } else {
            //         return pre + 1;
            //     }
            // });
            setUser((user) => {
                if (winUser._id.toString() === user._id.toString()) {
                    socket.emit("leave_room", { roomId: room._id, userId: winUser._id });
                    navigate("/lobby");
                    return winUser;
                } else {
                    return user;
                }
            });
        };

        socket.on("update_rooms", allRooms);

        socket.on("game_update", updateRoom);

        socket.on("after_leave_room_created", afterLeave);

        socket.on("resultWinner", alarmWinner);
        socket.on("winnerLeft", winnerLeftRoom);

        socket.on("error", errorHandler);

        /*   socket.on("user_left",allRooms) */
        return () => {
            socket.off("update_rooms", allRooms);
            socket.off("game_started", updateRoom);
            socket.off("after_leave_room_created", afterLeave);
            socket.off("game_updated", updateRoom);
            socket.off("resultWinner", alarmWinner);
            socket.off("winnerLeft", winnerLeftRoom);
            socket.off("error", errorHandler);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`http://localhost:8000/users/verify`, {
                    headers: {
                        token: token,
                    },
                })
                .then((res) => {
                    setUser(res.data.data);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    navigate("/");
                });
        }
        axios.get("http://localhost:8000/rooms").then((res) => {
            if (res.data.success) {
                setRooms(res.data.data);
            }
        });
    }, []);

    return (
        <MyContext.Provider
            value={{
                user,
                setUser,
                room,
                rooms,
                setRoom,
                setRooms,

                isUno,
                setIsUno,

                // Room Password
                passwordCorrect,
                setPasswordCorrect,
                password,
                setPassword,
                show,
                setShow,

                color,
                setColor,

                winner,
                setWinner,
            }}
        >
            {children}
        </MyContext.Provider>
    );
}
