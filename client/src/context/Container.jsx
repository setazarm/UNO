import { useEffect, useState } from "react";
import { MyContext } from "./context.js";
import { socket } from "../socket.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import useSound from "use-sound";
import messageSound from "../assets/sounds_uno/message.mp3";
import unoSound from "../assets/sounds_uno/uno_2.mp3";

export default function Container({ children }) {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const messagePlay = new Audio(messageSound);
    const uNOPlay = new Audio(unoSound);
    const [isUno, setIsUno] = useState(false);

    const [color, setColor] = useState("");

    const [winner, setWinner] = useState(null);
    const [messageList, setMessageList] = useState([]);

    const navigate = useNavigate();

    // const [playMessageSound] = useSound(messageSound, {
    //     volume: 0.45,
    //     playbackRate: 0.75,
    // });

    // const [playUnoSound] = useSound(unoSound, {
    //     volume: 0.45,
    // });

    // Room password checking
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const addMessageToList = (message) => {
        setMessageList((list) => [...list, message]);
    };

    useEffect(() => {
        const allRooms = (rooms) => {
            setRooms(rooms);
        };

        const updateRoom = (room) => {
            console.log("Container: ", room.gameData);
            setRoom(room);
        };

        const afterLeave = (rooms, userId) => {
            setUser((user) => {
                if (user._id.toString() === userId) {
                    setRoom(null);
                    setRooms(rooms);
                    setMessageList([]);
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
                    toast.error("Room name already in use ");
                    break;
                default:
                    if (error.message) {
                        toast.error(`${error.message}`);
                    } else {
                        toast.error("An error ocurred");
                    }
                    break;
            }
        };

        const incrementPoints = (updateUser) => {
            setUser((user) => {
                if (user._id === updateUser._id) {
                    return updateUser;
                }
                return user;
            });
        };

        const displayUno = (userName) => {
            setUser((user) => {
                if (user.name !== userName) {
                    toast.error(`${userName} says UNO!`);
                    console.log("PLS FIX THE SOUND");
                    //playUnoSound();
                    uNOPlay.play();
                }
                return user;
            });
        };
        const addingMessage = (message) => {
            addMessageToList(message);
            setUser((oldUser) => {
                if (oldUser.name !== message.author) {
                    // playMessageSound();
                    messagePlay.play();
                }
                return oldUser;
            });
            // if (user?.name !== message.author) {
            //     console.log("don't remove this console");
            //     playMessageSound();
            // }
        };
        socket.on("update_rooms", allRooms);

        socket.on("user_won", incrementPoints);

        socket.on("game_update", updateRoom);

        socket.on("after_leave_room_created", afterLeave);
        socket.on("uno_says", displayUno);

        socket.on("receive_message", addingMessage);

        socket.on("error", errorHandler);

        /*   socket.on("user_left",allRooms) */
        return () => {
            socket.off("update_rooms", allRooms);
            socket.off("game_started", updateRoom);
            socket.off("after_leave_room_created", afterLeave);
            socket.off("game_updated", updateRoom);
            socket.off("user_won", incrementPoints);
            socket.off("error", errorHandler);
            socket.off("uno_says", displayUno);
            socket.off("receive_message", addingMessage);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get(`/users/verify`, {
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
        axios.get("/rooms").then((res) => {
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
                messageList,
            }}
        >
            {children}
            <Toaster
                toastOptions={{
                    className: "",
                    style: {
                        border: "1px solid #713200",
                        padding: "32px",
                        color: "#713200",
                    },
                }}
            />
        </MyContext.Provider>
    );
}
