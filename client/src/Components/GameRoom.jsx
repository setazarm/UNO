import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";
import deckCard from "../assets/unoCards";
import calculateNextTurn from "../utilis/calculateNextTurn";
import Card from "./Card";
import setBgColor from "../utilis/setBgColor";
import Modal from "./Modal";
const GameRoom = () => {
    const { id } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [reverseTurn, setReverseTurn] = useState(false);
    const [skipTurn, setSkipTurn] = useState(false);
    const {
        user,

        room,
        rooms,
        setRoom,

        isUno,
        setIsUno,

        color,

        winner,
        setWinner,
    } = useContext(MyContext);

    const drawCard = (numOfCards) => {
        return room.gameData.drawPile.splice(0, numOfCards);
    };

    const startGame = () => {
        setShowPopup(false);
        socket.emit("start_game", {
            roomId: room._id,
        });
    };

    const leaveRoom = () => {
        socket.emit("leave_room", { userId: user._id, roomId: room });
    };

    useEffect(() => {
        setRoom(rooms.find((item) => item._id === id));
    }, [rooms, id]);

    const drawPileHandler = () => {
        if (room.players[room.gameData.turn]._id.toString() !== user._id.toString()) {
            alert("Not your turn");
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
                    turn: calculateNextTurn(
                        reverseTurn,
                        skipTurn,
                        room.gameData.turn,
                        room.players.length
                    ),
                },
            });
        }
    };

    const cardHandler = (card) => {
        if (room.players[room.gameData.turn]._id.toString() !== user._id.toString()) {
            console.log("Not your turn");
        } else {
            if (
                card.color === room.gameData.discardPile[0].color ||
                card.number === room.gameData.discardPile[0].number ||
                card.number === ""
            ) {
                if (card.number === "skip") {
                    setSkipTurn(true);
                }
                if (card.number === "_") {
                    setReverseTurn(true);
                }
                if (card.number === "" || card.number === "D4") {
                    setShowPopup(true);
                }

                const player = room.gameData.allPlayerCards.find(
                    (item) => item.userId === user._id
                );
                const cardIndex = player.cards.indexOf(card);
                player.cards.splice(cardIndex, 1);

                room.gameData.discardPile.unshift(card);

                socket.emit("update_game", {
                    ...room,
                    gameData: {
                        ...room.gameData,
                        turn: calculateNextTurn(
                            reverseTurn,
                            skipTurn,
                            room.gameData.turn,
                            room.players.length
                        ),
                    },
                });
            } else {
                alert("invalid card");
            }
        }
    };

    // NEEDS REWRITE !!!
    // useEffect(() => {
    //     if (playerCards?.length === 5 && !isUno) {
    //         alert("you have to say UNO");
    //     }

    //     room &&
    //         socket.emit("playerCards-status", {
    //             userId: user._id,
    //             roomId: room._id,
    //             length: playerCards?.length,
    //         });
    // }, [playerCards]);

    // NEEDS REWRITE !!!
    // useEffect(() => {
    //     if (playerCards?.length === 2) {
    //         setWinner(user.name);
    //         socket.emit("winner", {
    //             roomId: room._id,
    //             winner: user,
    //         });
    //         // alert(`winner is ${winner}`)
    //     }
    // }, [playerCards]);

    return (
        <div>
            {room && (
                <div>
                    {room &&
                        room.gameData.allPlayerCards.map((player) => {
                            return (
                                <h1>
                                    {player?.userId} : {player?.cards?.length}{" "}
                                </h1>
                            );
                        })}
                    <h3>players</h3>
                    <ul>
                        {room.players.map((player) => {
                            return <li key={player._id}>{player.name}</li>;
                        })}
                    </ul>
                    {room?.userId?.toString() === user._id.toString() ? (
                        <button
                            disabled={room.players.length <= 1}
                            onClick={startGame}
                            className="border-slate-950 border-2 p-1 rounded"
                        >
                            start game
                        </button>
                    ) : (
                        !room.players.includes(room.userId.toString()) &&
                        room.players[0]._id === user._id && (
                            <button onClick={startGame}>Start Game with First Player</button>
                        )
                    )}
                    <div className="flex">
                        <div>
                            <h3>Discard Pile</h3>
                            {room.gameData.discardPile && (
                                <div
                                    className={`flex justify-center w-[300px] ${setBgColor(
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
                            {<img className="w-[200px]" src={deckCard} onClick={drawPileHandler} />}
                        </div>
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
                        ?.cards.map((card, i) => {
                            return (
                                <div
                                    onClick={() => cardHandler(card)}
                                    className="inline-block"
                                    key={card.number + i}
                                >
                                    <Card color={card.color} number={card.number} />
                                </div>
                            );
                        })}

                    <button
                        // disabled={playerCards?.length !== 6}
                        onClick={() => setIsUno(true)}
                        className="border-slate-950 border-2 p-1 rounded"
                    >
                        UNO
                    </button>

                    <button
                        className="block border-slate-950 border-2 p-1 rounded"
                        onClick={leaveRoom}
                    >
                        Leave Room
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameRoom;
