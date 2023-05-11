import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";
const GameRoom = () => {
    const { id } = useParams();
    const {
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
        let { cards, pile } = drawCard(1, deck.slice(room?.players.length * 7));
        socket.emit("start_game", {
            userId: user._id,
            roomId: room._id,
            gameData: { ...playerCards, drawpile: pile, discardpile: cards },
        });
    };

    const leaveRoom = () => {
        socket.emit("leave_room", { userId: user._id, roomId: room });
    };

    useEffect(() => {
        setRoom(rooms.find((item) => item._id === id));
    }, [rooms, id]);

    const cardHandler = (card) => {
        if (room.players[turn]._id.toString() !== user._id.toString()) {
            alert("Not your turn");
        } else {
            if (
                card.color === discardpile[discardpile.length - 1].color ||
                card.number === discardpile[discardpile.length - 1].number
            ) {
                setPlayerCards((pre) => pre.filter((item) => item !== card));

                socket.emit("update_game", {
                    userId: user._id,
                    roomId: room._id,
                    gameData: {
                        ...playerCards,
                        drawpile: drawpile,
                        discardpile: [...discardpile, card],
                        turn: turn === room.players.length - 1 ? 0 : turn + 1,
                    },
                });
            } else {
                alert("invalid card");
            }
        }
    };

    return (
        <div>
            {room && (
                <div>
                    <h3>players</h3>
                    <ul>
                        {room.players.map((player) => {
                            return <li key={player._id}>{player.name}</li>;
                        })}
                    </ul>
                    {room.userId.toString() === user._id.toString() ? (
                        <button onClick={startGame}>start game</button>
                    ) : null}

                    <h3>player cards</h3>
                    {playerCards?.map((card, i) => {
                        return (
                            <div
                                onClick={() => cardHandler(card)}
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
                                key={card.number + i}
                            >
                                {card.number} {card.color}
                            </div>
                        );
                    })}

                    <h3>discardpile</h3>
                    {discardpile.length > 0 ? (
                        <div
                            className={`rounded-lg py-2 px-4 cursor-pointer ${
                                discardpile[discardpile.length - 1].color === "Y"
                                    ? "bg-yellow-400"
                                    : discardpile[discardpile.length - 1].color === "B"
                                    ? "bg-blue-400"
                                    : discardpile[discardpile.length - 1].color === "G"
                                    ? "bg-green-400"
                                    : discardpile[discardpile.length - 1].color === "R"
                                    ? "bg-red-400"
                                    : ""
                            }`}
                        >
                            {discardpile[discardpile.length - 1].number}{" "}
                            {discardpile[discardpile.length - 1].color}
                        </div>
                    ) : null}

                    <button onClick={leaveRoom}>leave room</button>
                </div>
            )}
        </div>
    );
};

export default GameRoom;
