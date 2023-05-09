import { Outlet } from "react-router-dom";
import Container from "../context/Container.jsx";
import Lobby from "./Lobby.jsx";
import CreateRoom from "./CreateRoom.jsx";
import GameRoom from "./GameRoom.jsx";

const Game = () => {
    return (
        <Container>
            <Outlet />
        </Container>
    );
};
export default Game;
