import { useEffect, useState } from "react";
import { MyContext } from "./context.js";
import { socket } from "../socket.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Container({ children }) {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [isUno, setIsUno] = useState(false);

    const [color, setColor] = useState("");

    const [winner, setWinner] = useState(null);
    const [messageList, setMessageList] = useState([]);

    const navigate = useNavigate();

    // Room password checking
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const addMessageToList = (message) => {
        console.log(message,"message")
        setMessageList((list) => [...list, message]);
      };

    useEffect(() => {
        const allRooms = (rooms) => {
            setRooms(rooms);
        };

        const updateRoom = (room) => {
            console.log("room", room);
            setRoom(room);
        };

        const afterLeave = (rooms, userId) => {
            setUser((user) => {
                if (user._id.toString() === userId) {
                    setRoom(null);
                    setRooms(rooms);
                    setMessageList([])
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

         const displayUno =(userName)=> {
            setUser(user =>{
                if(user.name !== userName){
                    toast.error(`${userName} says UNO!`)
                }
                return user
            })
            
         }
         const addingMessage = (message) => {
            addMessageToList(message);

         }
        socket.on("update_rooms", allRooms);

        socket.on("user_won", incrementPoints);

        socket.on("game_update", updateRoom);

        socket.on("after_leave_room_created", afterLeave);
        socket.on('uno_says', displayUno);
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
                messageList
               

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
