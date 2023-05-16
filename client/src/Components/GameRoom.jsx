import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";
import deckCard from "../assets/unoCards";
import calculateNextTurn from "../utilis/calculateNextTurn";
import Card from "./Card";
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
        isUno,
        setIsUno,
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
        
        if (room.players[turn]._id.toString() !== user._id.toString()) {
            alert("Not your turn");
        } else {
            let skipTurn = false;
            let reverseTurn = false;

            if (
                card.color === discardpile[discardpile.length - 1].color ||
                card.number === discardpile[discardpile.length - 1].number
            ) {
                setPlayerCards((pre) => pre.filter((item) => item !== card));

                if (card.number === "skip") {
                    
                    skipTurn = true;
                   
                }
                if (card.number === "_") {
                    reverseTurn = true;
                   
                }
                console.log(card.number);
                console.log(reverseTurn);
                console.log(skipTurn);

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
    useEffect(()=>{
        if(playerCards.length === 5 && !isUno){
            alert('you have to say UNO')
            setPlayerCards((pre)=>[...pre, ...drawpile.splice(0,2)])
            
            
        }


    },[playerCards])
  
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
                                <div>
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


                    <button disabled={playerCards.length!==6} onClick={() => setIsUno(true)}>UNO</button>


                    <button className="block" onClick={leaveRoom}>
                        leave room
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameRoom;
