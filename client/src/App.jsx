import {Routes, Route} from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<RegisterForm/>} />
                <Route path="" />
            </Routes>
        </>
    );
}

export default App;
