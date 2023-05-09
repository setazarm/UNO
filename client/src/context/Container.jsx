import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./context.js";
import { socket } from "../socket.js";
import shuffleArray from "../utilis/shuffleCard.js";
import card from "../utilis/card.js";
import axios from "axios";

const Container = ({ children }) => {
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState(null);
    const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("user")));
    const [playerCards, setPlayerCards] = useState([]);
    const [drawpile, setDrawpile] = useState([]);
    const [discardpile, setDiscardpile] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [rooms, setRooms] = useState([]);
    const deck = shuffleArray(card);

    useEffect(() => {
        socket.connect();
        const receiveInitialData = (data) => {
            console.log("inside socket");
            setDrawpile(data.drawpile);
            setDiscardpile(data.discardpile);
            const pCard = deck.slice(0, 7);
            setPlayerCards(pCard);
            setIsGameStarted(true);
        };

        const receiveRoomData = (room) => {
            setRoomData({ ...room });
            console.log(room);
            if (room.isFull) {
                navigate("/game/lobby");
            }
        };

        const receiveDeleteRoomEvent = () => {
            console.log("delete_room triggered");
            axios.get("http://localhost:8000/rooms").then((res) => {
                console.log(res.data.data);
                setRooms(res.data.data);
            });
        };

        const receiveRoomCreatedEvent = (roomID) => {
            navigate(`/game/${roomID}`);
        };

        socket.on("room_created", receiveRoomCreatedEvent);
        socket.on("room_data", receiveRoomData);
        socket.on("initialData", receiveInitialData);
        socket.on("delete_room", receiveDeleteRoomEvent);
        return () => {
            socket.off("room_created", receiveRoomCreatedEvent);
            socket.off("room_data", receiveRoomData);
            socket.off("initialData", receiveInitialData);
            socket.off("delete_room", receiveDeleteRoomEvent);
            // socket.disconnect();
        };
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8000/rooms").then((res) => {
            setRooms(res.data.data);
        });
    }, []);

    useEffect(() => {
        setPlayer({ ...player, cards: playerCards });
    }, [playerCards, isGameStarted]);

    return (
        <MyContext.Provider
            value={{
                roomData,
                setRoomData,
                player,
                setPlayer,
                playerCards,
                setPlayerCards,
                drawpile,
                setDrawpile,
                discardpile,
                setDiscardpile,
                isGameStarted,
                setIsGameStarted,
                rooms,
                setRooms,
                deck,
            }}
        >
            {children}
        </MyContext.Provider>
    );
};
export default Container;
