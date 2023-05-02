import { Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm.jsx";
import NavBar from "./Components/NavBar.jsx";
function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
        </>
    );
}

export default App;
