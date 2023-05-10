// import card from "../utilis/card.js";
// import shuffleArray from "../utilis/shuffleCard.js";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context.js";
import axios from "axios";

// const GameRoom = () => {
//     const navigate = useNavigate();
//     const location = useParams();
//     const [roomData, setRoomData] = useState(null);
//     const [player, setPlayer] = useState(JSON.parse(localStorage.getItem("user")));
//     const [playerCards, setPlayerCards] = useState([]);
//     const [drawpile, setDrawpile] = useState([]);
//     const [discardpile, setDiscardpile] = useState([]);
//     const [isGameStarted, setIsGameStarted] = useState(false);
//     const deck = shuffleArray(card);

//     const getUserFromLocalStorage = () => {
//         const user = JSON.parse(localStorage.getItem("user"));
//         return user;
//     };

//     const drawCard = (numOfcards, pile) => {
//         const cards = [];
//         for (let i = 0; i < numOfcards; i++) {
//             const card = pile.shift();
//             cards.push(card);
//         }

//         return { cards, pile };
//     };

//     const startGame = () => {
//         let { cards, pile } = drawCard(1, deck.slice(roomData?.players.length * 7));
//         socket.emit(
//             "initGameState",
//             { ...playerCards, drawpile: pile, discardpile: cards },
//             location.id
//         );
//     };

//     useEffect(() => {
//         const user = getUserFromLocalStorage();
//         socket.emit("join_room", location.id, user._id);
//     }, []);

//     socket.on("initialData", (data) => {
//         setDrawpile(data.drawpile);
//         setDiscardpile(data.discardpile);
//         const pCard = deck.slice(0, 7);
//         setPlayerCards(pCard);
//         setIsGameStarted(true);
//     });

//     useEffect(() => {
//         socket.on("room_data", (room) => {
//             setRoomData(room);
//             if (room.isFull) {
//                 navigate("/lobby");
//             }
//         });

//         return () => {
//             const user = getUserFromLocalStorage();
//             socket.emit("leave_room", location.id, user._id);
//         };
//     }, []);

//     useEffect(() => {
//         setPlayer({ ...player, cards: playerCards });
//     }, [playerCards, isGameStarted]);

//     return (
//         <div>
//             <div>
//                 <ul>
//                     {roomData &&
//                         roomData.players.map((player, i) => {
//                             return <li key={player._id}>{player.name}</li>;
//                         })}
//                 </ul>
//             </div>
//             <button onClick={() => startGame()}>Start the Game</button>
//             <div>
//                 {isGameStarted ? (
//                     <>
//                         <div
//                             onClick={() => {}}
//                             className="bg-yellow-400 rounded-lg py-2 px-4 cursor-pointer hover:bg-yellow-500 active:bg-yellow-600"
//                         >
//                             Drawpile
//                         </div>
//                         <div
//                             className={`rounded-lg py-2 px-4 cursor-pointer ${
//                                 discardpile[0]?.color === "Y"
//                                     ? "bg-yellow-400"
//                                     : discardpile[0]?.color === "B"
//                                     ? "bg-blue-400"
//                                     : discardpile[0]?.color === "G"
//                                     ? "bg-green-400"
//                                     : discardpile[0]?.color === "R"
//                                     ? "bg-red-400"
//                                     : ""
//                             }`}
//                         >
//                             {discardpile[0]?.number} {discardpile[0]?.color}
//                         </div>

//                         <div>
//                             cards
//                             {player.cards?.map((card, i) => {
//                                 return (
//                                     <div
//                                         key={i}
//                                         className={`rounded-lg py-2 px-4 cursor-pointer ${
//                                             card.color === "Y"
//                                                 ? "bg-yellow-400"
//                                                 : card.color === "B"
//                                                 ? "bg-blue-400"
//                                                 : card.color === "G"
//                                                 ? "bg-green-400"
//                                                 : card.color === "R"
//                                                 ? "bg-red-400"
//                                                 : ""
//                                         }`}
//                                     >
//                                         {card.number} {card.color}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </>
//                 ) : null}
//             </div>
//         </div>
//     );
// };

const GameRoom = () => {
    const location = useParams();
    const [leftRoom, setLeftRoom] = useState(false);

    const {
        roomData,
        player,
        playerCards,
        drawpile,
        discardpile,
        isGameStarted,
        deck,
        setRoomData,
    } = useContext(MyContext);

    const drawCard = (numOfcards, pile) => {
        const cards = [];
        for (let i = 0; i < numOfcards; i++) {
            const card = pile.shift();
            cards.push(card);
        }

        return { cards, pile };
    };

    const startGame = () => {
        let { cards, pile } = drawCard(1, deck.slice(roomData?.players.length * 7));
        socket.emit(
            "initGameState",
            { ...playerCards, drawpile: pile, discardpile: cards },
            location.id
        );
       
      
    };

    useEffect(() => {
        socket.emit("join_room", location.id, player._id);
    
        axios.get("http://localhost:8000/rooms").then((res) => {
          setRoomData(res.data.data.find((item) => item._id.toString() === location.id));
        });
    
        return () => {
          if (!leftRoom) {
            socket.emit("leave_room", location.id, player._id);
            setLeftRoom(true);
          }
        };
      }, []);

    return (
        <div>
            <div>
                <ul>
                    {roomData &&
                        roomData.players.map((player, i) => {
                            console.log(player._id);
                            return <li key={player._id + i}>{player.name}</li>;
                        })}
                </ul>
            </div>
            <button onClick={() => startGame()}>Start the Game</button>
            <div>
                {isGameStarted ? (
                    <>
                        <div
                            onClick={() => {}}
                            className="bg-yellow-400 rounded-lg py-2 px-4 cursor-pointer hover:bg-yellow-500 active:bg-yellow-600"
                        >
                            Drawpile
                        </div>
                        <div
                            className={`rounded-lg py-2 px-4 cursor-pointer ${
                                discardpile[0]?.color === "Y"
                                    ? "bg-yellow-400"
                                    : discardpile[0]?.color === "B"
                                    ? "bg-blue-400"
                                    : discardpile[0]?.color === "G"
                                    ? "bg-green-400"
                                    : discardpile[0]?.color === "R"
                                    ? "bg-red-400"
                                    : ""
                            }`}
                        >
                            {discardpile[0]?.number} {discardpile[0]?.color}
                        </div>

                        <div>
                            cards
                            {player.cards?.map((card, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`rounded-lg py-2 px-4 cursor-pointer ${
                                            card.color === "Y"
                                                ? "bg-yellow-400"
                                                : card.color === "B"
                                                ? "bg-blue-400"
                                                : card.color === "G"
                                                ? "bg-green-400"
                                                : card.color === "R"
                                                ? "bg-red-400"
                                                : ""
                                        }`}
                                    >
                                        {card.number} {card.color}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default GameRoom;
