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
    const [isUno, setIsUno] = useState(false);

    const[color, setColor] =useState('')

    const [winner,setWinner]=useState(null)
    const [isStarted,setIsStarted]=useState(false)

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
        };
        const updateGame = (gamedata) => {
            console.log("game updated");
            setGame(gamedata);
            console.log(gamedata);
            
            setDrawpile(gamedata.drawpile);
            setDiscardpile(gamedata.discardpile);
            setTurn(gamedata.turn);
            setIsUno(gamedata.isUno);
            setWinner(gamedata.winner)
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


        const errorHandler = (error) => {
            console.log(error);
            switch (error.code) {
                case 11000:
                    alert("Room name already in use ");
                    break;
                default:
                    if (error.message) {
                        alert(`${error.message}`);
                    } else {
                        alert("An error ocurred");
                    }
                    break;
            }
        };

        const alarmWinner=(winner,roomId)=>{
            console.log(`winner is ${winner.name}`)
            setUser(user=>{
                console.log("user",user)
                console.log("winner",winner)
                if(user._id.toString()===winner._id.toString()){
                    setWinner(winner)
                    socket.emit("leaveWinner",{
                        roomId,
                        userId:user._id

                    })
                  
                }
                return user
            })
    
           
        }
        const winnerLeftRoom=(room,winUser)=>{
            console.log(room, winUser)
            
            
          setRoom(room)
          setTurn(pre=>{
                if(pre===room.players.length-1){
                    return 0
                }else{
                    return pre+1
                }
          })
            setUser(user=>{
                if(winUser._id.toString()===user._id.toString()){
                    socket.emit("leave_room",{roomId:room._id,userId:winUser._id})
                    navigate("/lobby")
                    return winUser
                    }else{
                        return user
                    }
                  
        

            })
           

        }
       


        socket.on("update_rooms", allRooms);

        socket.on("game_started", getGameData);

        socket.on("after_leave_room_created", afterLeave);

        socket.on("game_updated", updateGame);
        socket.on("resultWinner",alarmWinner)
        socket.on("winnerLeft",winnerLeftRoom)

        socket.on("error", errorHandler);

        /*   socket.on("user_left",allRooms) */
        return () => {
            socket.off("update_rooms", allRooms);
            socket.off("game_started", getGameData);
            socket.off("after_leave_room_created", afterLeave);
            socket.off("game_updated", updateGame);
            socket.off("resultWinner",alarmWinner)
            socket.off("winnerLeft",winnerLeftRoom)
            socket.off("error", errorHandler);
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
    //     checkWinner(room.players);
    // }, [room.players]);
    

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
                isUno,
                setIsUno,

                color,
                setColor,

                winner,
                setWinner

            }}
        >
            {children}
        </MyContext.Provider>
    );
}
