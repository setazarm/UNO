import { useEffect, useState } from "react";
import { MyContext } from "./context.js";
import { socket } from "../socket.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import shuffleArray from "../utilis/shuffleCard.js";
import card from "../utilis/card.js";
export default function Container({ children }) {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [players, setPlayers] = useState([]);
    const [game, setGame] = useState([]);
    const [drawpile, setDrawpile] = useState([]);
    const [discardpile, setDiscardpile] = useState([]);
    const [playerCards, setPlayerCards] = useState([]);
    const [turn, setTurn] = useState(0);
    const navigate = useNavigate();
    const deck = shuffleArray(card);

    // Room password checking
    const [passwordCorrect, setPasswordCorrect] = useState(false);
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    console.log(socket.id);
    useEffect(() => {
        const allRooms = (rooms) => {
            console.log("working");
            setRooms(rooms);
        };

        const getGameData = (gamedata) => {
            setTurn(0);
            setGame(gamedata);
            setDrawpile(gamedata.drawpile);
            setDiscardpile(gamedata.discardpile);
            const pCard = deck.slice(0, 7);
            setPlayerCards(pCard);
            console.log("here");
        };
        const updateGame = (gamedata) => {
            console.log("game updated");
            setGame(gamedata);
            console.log(gamedata);
            setDrawpile(gamedata.drawpile);
            setDiscardpile(gamedata.discardpile);
            setTurn(gamedata.turn);
        };

        const afterLeave = (rooms, userId) => {
            setUser((user) => {
                if (user._id.toString() === userId) {
                    setRooms(rooms);

                    navigate("/lobby");
                    setPlayerCards([]);
                    setDrawpile([]);
                    setDiscardpile([]);
                    return user;
                } else {
                    setRooms(rooms);
                    return user;
                }
            });
        };
        socket.on("room_created", allRooms);

        socket.on("game_started", getGameData);

        socket.on("after_leave_room_created", afterLeave);

        socket.on("game_updated", updateGame);

        /*   socket.on("user_left",allRooms) */
        return () => {
            socket.off("room_created", allRooms);
            socket.off("game_started", getGameData);
            socket.off("after_leave_room_created", afterLeave);
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
                players,
                setPlayers,
                game,
                setGame,
                drawpile,
                setDrawpile,
                discardpile,
                setDiscardpile,
                playerCards,
                setPlayerCards,
                deck,
                turn,
                setTurn,
                passwordCorrect,
                setPasswordCorrect,
                password,
                setPassword,
                show,
                setShow,
            }}
        >
            {children}
        </MyContext.Provider>
    );
}
