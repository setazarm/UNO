import { Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm.jsx";
import NavBar from "./Components/NavBar.jsx";
import Lobby from "./Components/Lobby.jsx";
import CreateRoom from "./Components/CreateRoom.jsx";
import GameRoom from "./Components/GameRoom";
import Footer from "./Components/Footer.jsx";
import Imprint from "./Components/Imprint.jsx";
import Profile from "./Components/Profile";
function App() {
    return (
        <div className="flex flex-col h-screen">
            <NavBar />
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/createRoom" element={<CreateRoom />} />
                <Route path="/game/:id" element={<GameRoom />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
