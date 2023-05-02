import { Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm.jsx";
import NavBar from "./Components/NavBar.jsx";
import Lobby from "./Components/Lobby.jsx";
import CreateRoom from "./Components/CreateRoom.jsx";
import GameRoom from "./Components/GameRoom";
function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/createRoom" element={<CreateRoom/>} />
                <Route path="/game" element={<GameRoom/>} />
            </Routes>
        </>
    );
}

export default App;
