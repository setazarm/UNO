import { useParams } from "react-router-dom";
import { socket } from "../socket.js";
import { useEffect, useState } from "react";
import card from "../utilis/card.js";
import shuffleArray from "../utilis/shuffleCard.js";

const GameRoom = () => {
    const location = useParams();
    const [roomData, setRoomData] = useState(null);
    const [player1Cards, setPlayer1Cards] = useState([]);
    const [player2Cards, setPlayer2Cards] = useState([]);
    const [drawpile, setDrawpile] = useState([]);
    //const [currentCard, setCurrentCard] = useState(null);
const [discardpile, setDiscardpile] = useState([]);
     const deck = shuffleArray(card);
   
    const receiveMessage = (GameState) => {
        console.log(GameState);
    };

    useEffect(() => {
        socket.on("reply", receiveMessage);
        socket.on("room_data", (room) => {
            setRoomData(room);
        });
        return () => {
            socket.emit("leave_room"); // Logic trigger for removing player from DB
            socket.off("reply", receiveMessage);
            socket.disconnect();
        };
    }, []);
   
     const drawCard = (numOfcards,pile) => {
        const  cards =[]
        for(let i = 0; i < numOfcards; i++){
        const card=pile.shift()
        cards.push(card)
        

        }
        
        // console.log("hello")
        // console.log(drawpile)
        // console.log(cards)
        console.log(cards)
         return {cards,pile}    
     }
    
      //console.log(discardpile)
      const startGame = () => {
       let player1Cards=deck.slice(0,7)
         let player2Cards=deck.slice(7,14)
           let {cards,pile} = drawCard(1,deck.slice(14))
        console.log(deck)
          socket.emit("initGameState",{player1Cards,player2Cards,drawpile:pile,discardpile:cards},location.id)
         
    }
  
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        socket.emit("join_room", location.id, user._id);
      socket.on("initialData",(data)=>{
        console.log(data)
        setPlayer1Cards(data.player1Cards)
        setPlayer2Cards(data.player2Cards)
        setDrawpile(data.drawpile)
        setDiscardpile(data.discardpile)
      })
       
    },[])
      //console.log(drawpile)
    //  console.log(drawpile.length)
    //  console.log(drawCard(2))
    //  console.log(drawpile.length)

// console.log(player1Cards)
// console.log(player2Cards)
// console.log(drawpile)
    return (
        <div>
            <div>
                <ul>
                    {roomData &&
                        roomData.players.map((player) => {
                            return <li>{player}</li>;
                        })}
                </ul>
            </div>
            <button onClick={() => socket.emit("initGameState","GameState" , location.id)}>
              Start 
            </button>
            <button onClick={() => startGame()}>Start the Game</button>
        </div>
    );
};

export default GameRoom;
