import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";
import deckCard from "../assets/unoCards";
import calculateNextTurn from "../utilis/calculateNextTurn";
import Card from "./Card";
import setBgColor from "../utilis/setBgColor";
import Modal from "./Modal";
import toast, { Toaster } from "react-hot-toast";
const GameRoom = () => {
    const { id } = useParams();
    const [showPopup, setShowPopup] = useState(false);

    const { user, room, rooms, setRoom, color, winner, setWinner } = useContext(MyContext);

    const drawCard = (numOfCards) => {
        return room.gameData.drawPile.splice(0, numOfCards);
    };

    const startGame = () => {
        setShowPopup(false);
        if (room.players.length < 2) {
            toast.error("You need at least 2 people to start the game");
        } else {
            socket.emit("start_game", {
                roomId: room._id,
            });
        }
    };
    console.log("object");
    const leaveRoom = () => {
        socket.emit("leave_room", { userId: user._id, roomId: room });
    };

    useEffect(() => {
        setRoom(rooms.find((item) => item._id === id));
    }, [rooms, id]);

    const drawPileHandler = () => {
        if (room.players[room.gameData.turn]._id.toString() !== user._id.toString()) {
            toast.error("Not your turn");
        } else {
            const drawnCards = drawCard(1);
            const allPlayerCards = room.gameData.allPlayerCards.map((player) => {
                if (player.userId === user._id) {
                    player.cards.push(...drawnCards);
                }
                return player;
            });

            socket.emit("update_game", {
                ...room,
                gameData: {
                    ...room.gameData,
                    allPlayerCards,
                    turn: calculateNextTurn(false, false, room.gameData.turn, room.players.length),
                },
            });
        }
    };

    const cardHandler = (card) => {
        if (room.players[room.gameData.turn]._id.toString() !== user._id.toString()) {
            toast.error("Not your turn");
        } else {
            if (
                card.color === room.gameData.discardPile[0].color ||
                card.number === room.gameData.discardPile[0].number ||
                card.number === ""
            ) {
                if (card.number === "" || card.number === "D4") {
                    setShowPopup(true);
                }

                const player = room.gameData.allPlayerCards.find(
                    (item) => item.userId === user._id
                );

                let allPlayerCards = room.gameData.allPlayerCards;

                if (!(player.cards.length === 4 && !player.isUno)) {
                    const cardIndex = player.cards.indexOf(card);
                    player.cards.splice(cardIndex, 1);
                    room.gameData.discardPile.unshift(card);

                    player.isUno = false;

                    if (player.cards.length === 3) {
                        toast.error("You won !!");
                        room.gameData.gameOver.status = true;
                        room.gameData.gameOver.winner = player.userId;
                    }
                } else {
                    toast.error("You didn't say UNO!");

                    const drawnCards = drawCard(2);
                    allPlayerCards = room.gameData.allPlayerCards.map((player) => {
                        if (player.userId === user._id) {
                            player.cards.push(...drawnCards);
                        }
                        return player;
                    });
                }

                // Remove the card from players hand and put it on the discard pile
                // const cardIndex = player.cards.indexOf(card);
                // player.cards.splice(cardIndex, 1);

                // room.gameData.discardPile.unshift(card);

                socket.emit("update_game", {
                    ...room,
                    gameData: {
                        ...room.gameData,
                        turn: calculateNextTurn(
                            card.number === "_" ? true : false,
                            card.number === "skip" ? true : false,
                            room.gameData.turn,
                            room.players.length
                        ),
                        allPlayerCards,
                    },
                });
            } else {
                toast.error("invalid card");
            }
        }
    };

    const checkUno = () => {
        const player = room.gameData.allPlayerCards.find((item) => item.userId === user._id);
        if (player.cards.length === 4) {
            player.isUno = true;
        }
    };

    return (
        <div
            style={{
                backgroundColor: room?.bgColor ? room?.bgColor : "#f5f5f5",
                color: room?.bgColor === "#010101" ? "white" : "black",
            }}
            className="min-h-screen w-screen flex flex-col p-6"
        >
            {room && (
                <div>
                    {room.isStarted ? (
                        <div>
                            {room.gameData.allPlayerCards.map((player) => (
                                <h1 key={player?.userId}>
                                    {player?.name} : {player?.cards?.length}{" "}
                                </h1>
                            ))}
                        </div>
                    ) : (
                        <div>
                            {room.players.map((player) => {
                                return <h1 key={player?._id}>{player?.name}</h1>;
                            })}
                        </div>
                    )}
                    {!room.gameData.gameOver.status ? (
                        <div>
                            {room?.userId?.toString() === user._id.toString() ? (
                                <button
                                    // disabled={room.players.length <= 1}
                                    onClick={startGame}
                                    className={`p-3 rounded m-2 bg-green-500 hover:bg-green-600 text-white block ${
                                        !room.isStarted ? "m-auto" : ""
                                    } font-bold`}
                                >
                                    Start Game
                                </button>
                            ) : (
                                !room.players.includes(room.userId.toString()) &&
                                room.players[0]._id === user._id && (
                                    <button onClick={startGame}>
                                        Start Game with First Player
                                    </button>
                                )
                            )}
                            <div className="flex">
                                <div hidden={!room.isStarted}>
                                    <div>
                                        <h3>Discard Pile</h3>
                                        {room.gameData.discardPile && (
                                            <div
                                                className={`flex justify-center w-[230px] opacity-80 rounded-md ${setBgColor(
                                                    room.gameData.discardPile[0]?.color
                                                )}`}
                                            >
                                                <Card
                                                    color={room.gameData.discardPile[0]?.color}
                                                    number={room.gameData.discardPile[0]?.number}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3>Draw Pile</h3>
                                        <img
                                            className="w-[200px]"
                                            src={deckCard}
                                            onClick={drawPileHandler}
                                        />
                                    </div>

                                    {showPopup && (
                                        <Modal
                                            setShowPopup={setShowPopup}
                                            skipTurn={skipTurn}
                                            reverseTurn={reverseTurn}
                                            drawCard={drawCard}
                                        />
                                    )}
                                    <h3>player cards</h3>
                                    {room.gameData.allPlayerCards
                                        .find((item) => item.userId === user._id)
                                        ?.cards.map((card, i) => (
                                            <div
                                                onClick={() => cardHandler(card)}
                                                className="inline-block"
                                                key={card.number + i}
                                            >
                                                <Card color={card.color} number={card.number} />
                                            </div>
                                        ))}

                                    <button
                                        // disabled={playerCards?.length !== 6}
                                        onClick={checkUno}
                                        className="border-slate-950 border-2 p-1 rounded"
                                    >
                                        UNO
                                    </button>
                                </div>
                            </div>

                            <button
                                className={`p-3 rounded mt-6 bg-green-500 hover:bg-green-600  text-white block ${
                                    !room.isStarted ? "m-auto" : ""
                                } font-bold`}
                                onClick={leaveRoom}
                            >
                                Leave Room
                            </button>
                        </div>
                    ) : (
                        <div className="text-gray-200 rounded-md p-8 mt-4 w-2/3 mx-auto bg-[#0d6fa3]">
                            <h1 className="text-center text-lg font-bold">The game is over</h1>
                            <h2 className="text-center mb-8 text-lg font-semibold">
                                {room?.gameData?.gameOver?.winner?.name} has won
                            </h2>
                            <button
                                // disabled={room.players.length <= 1}
                                onClick={startGame}
                                className={`p-3 rounded m-2 bg-green-500 hover:bg-green-600 text-white block ${
                                    !room.isStarted ? "m-auto" : ""
                                } font-bold`}
                            >
                                Play Again
                            </button>
                            <button
                                className={`p-3 rounded mt-6 bg-green-500 hover:bg-green-600  text-white block ${
                                    !room.isStarted ? "m-auto" : ""
                                } font-bold`}
                                onClick={leaveRoom}
                            >
                                Leave Room
                            </button>
                        </div>
                    )}
                </div>
            )}
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
        </div>
    );
};

export default GameRoom;
