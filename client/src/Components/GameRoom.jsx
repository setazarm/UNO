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
        isUno,
        setIsUno,

        color,

        winner,
        setWinner,
        setIsStarted,
        isStarted,
        board,
        setBoard
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
        setShowPopup(false);
        let { cards, pile } = drawCard(1, deck.slice(room?.players.length * 7));
        socket.emit("start_game", {
            userId: user._id,
            roomId: room._id,

            gameData: { ...playerCards, drawpile: pile, discardpile: cards },
        });
        setIsStarted(true);
    };

    const leaveRoom = () => {
        socket.emit("leave_room", { userId: user._id, roomId: room });
    };

    useEffect(() => {
        setRoom(rooms.find((item) => item._id === id));
    }, [rooms, id]);

    const drawpileHandler = () => {
        if (room.players[turn]._id.toString() !== user._id.toString()) {
            alert("Not your turn");
        } else {
            let { cards, pile } = drawCard(1, drawpile);
            setPlayerCards((pre) => [...pre, ...cards]);

            socket.emit("update_game", {
                userId: user._id,
                roomId: room._id,
                gameData: {
                    ...playerCards,
                    drawpile: pile,
                    discardpile: discardpile,
                    turn: turn === room.players.length - 1 ? 0 : turn + 1,
                    isUno: false,
                },
            });
        }
    };

    const cardHandler = (card) => {
        console.log("room player", room.players[turn]);
        console.log("user string", user);

        if (room.players[turn]._id.toString() !== user._id.toString()) {
            console.log("Not your turn");
        } else {
            if (
                card.color === discardpile[discardpile.length - 1].color ||
                card.number === discardpile[discardpile.length - 1].number ||
                card.number === ""
            ) {
                setPlayerCards((pre) => pre.filter((item) => item !== card));

                if (card.number === "skip") {
                    setSkipTurn(true);
                }
                if (card.number === "_") {
                    setReverseTurn(true);
                }
                if (card.number === "" || card.number === "D4") {
                    setShowPopup(true);
                }

                console.log(showPopup, "popup");

                console.log(card.number);
                console.log(reverseTurn);
                console.log(skipTurn);
                // if(playerCards.length===4){
                //     setWinner(user.name)
                //     socket.emit("winner", {
                //         roomId: room._id,
                //         winner: user,
                //     } )
                //     // alert(`winner is ${winner}`)

                // }

                socket.emit("update_game", {
                    userId: user._id,
                    roomId: room._id,
                    gameData: {
                        ...playerCards,
                        drawpile: drawpile,
                        discardpile: [...discardpile, card],
                        turn: calculateNextTurn(reverseTurn, skipTurn, turn, room.players.length),

                        isUno: false,
                      
                    },
                });
            } else {
                alert("invalid card");
            }
        }
    };

    useEffect(() => {
        if (playerCards.length === 5 && !isUno) {
            alert("you have to say UNO");
            setPlayerCards((pre) => [...pre, ...drawpile.splice(0, 2)]);

        }
        console.log("rooom",room)

        room && socket.emit("playerCards-status", {

                userId: user._id,
                roomId: room._id,
                length: playerCards.length
                
        }
            

            )
    }, [playerCards]);

    // useEffect(()=>{
    //     if(isStarted && playerCards.length===4){
    //          setWinner(user.name)
    //         alert(`winner is ${user.name}`)

    //     }
    // },[playerCards])

    // const checkWinner = (players) => {
    //     if(isStarted){
    //     players.forEach((player) => {
    //         if (player.cards.length === 4) {
    //             setWinner(player.name);
    //             alert(`winner is ${player.name}`);
    //         }
    //     });
    // }
    // };
    // useEffect(() => {
    //     if(isStarted){

    //     checkWinner(room.players);
    //     }
    // }, []);

    // console.log("room here",room.players)

    useEffect(() => {
        console.log(playerCards, 'playercards');
        if (playerCards.length === 2) {

            setWinner(user.name);
            socket.emit("winner", {
                roomId: room._id,
                winner: user,
            });
            // alert(`winner is ${winner}`)
        }
    }, [playerCards.length]);

    console.log("playercardssssss", playerCards);
  console.log(room?.bgColor, 'color');

    console.log("board", board);

    return (
        <div
        style={{
            backgroundColor: room?.bgColor ? room?.bgColor : "#f5f5f5",
            color: room?.bgColor === "#010101" ? "white" : "black"
        }}
        
            
        >
            {room && (
                <div >
                    {board&& board.map((item)=>{
                        return <h1>{item?.user?.name} : {item?.card} </h1>
                    })}
                    <h3>players</h3>
                    <ul>
                        {room.players.map((player) => {
                            return <li key={player._id}>{player.name}</li>;
                        })}
                    </ul>
                    {room.userId.toString() === user._id.toString() ? (
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
                            {discardpile.length > 0 ? (
                                <div
                                    className={`flex justify-center w-[300px] ${setBgColor(
                                        discardpile[discardpile.length - 1].color
                                    )}`}
                                >
                                    <Card
                                        color={discardpile[discardpile.length - 1].color}
                                        number={discardpile[discardpile.length - 1].number}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <h3>Draw Pile</h3>
                            {drawpile.length > 0 ? (
                                <img
                                    className="w-[200px]"
                                    src={deckCard}
                                    onClick={drawpileHandler}
                                />
                            ) : null}
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
                    {playerCards?.map((card, i) => {
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
                        disabled={playerCards.length !== 6}
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
