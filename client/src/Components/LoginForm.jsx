import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import uno from "../assets/Dizajn_bez_naslova__7_-removebg-preview.png";
import { MyContext } from "../context/context";
import { socket } from "../socket.js";
import { BiShow } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
const LoginForm = ({ setIsloading }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isShowed, setIsShowed] = useState(false);
    const { setUser, user } = useContext(MyContext);
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password,
        };
        axios
            .post("/users/login", data)
            .then((res) => {
                setUser({ ...res.data.data, socketId: socket.id });
                socket.emit("user_connected", { userId: res.data.data._id, socketId: socket.id });
                localStorage.setItem("token", res.headers.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify({ ...res.data.data, socketId: socket.id })
                );
                setIsloading(true);
                navigate("/lobby");
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <div className="bg-gradient-to-br from-cyan-300 via-cyan-500 to-cyan-700 min-h-screen flex flex-col justify-center items-center p-6">
            <h1
                className="
            text-3xl
            my-5
            
            "
            >
                Welcome to UNO Game
            </h1>
            <div className="flex">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col  p-6 outline-double outline-2 rounded "
                >
                    <h2
                        className="
             text-center
            "
                    >
                        Login Form
                    </h2>
                    <label htmlFor="email">Email</label>
                    <input
                        className="outline-double outline-2 outline-gray-500 my-2 px-1"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        className="outline-double outline-2 outline-gray-500 my-2 px-1"
                        type={isShowed ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <div>
                        <BiShow
                            className="text-2xl"
                            onClick={() => {
                                setIsShowed(!isShowed);
                            }}
                        />
                    </div>
                    <button
                        className="
                text-gray-100
                bg-blue-500
                p-2
                my-2
                rounded-sm
                hover:bg-blue-700

                "
                        type="submit"
                    >
                        Login
                    </button>
                    <div
                        className="
            my-2
            "
                    >
                        <p>
                            Do not have an account?
                            <button
                                className="
                        text-white
                        hover:text-blue-700
                        mx-2
                        "
                                onClick={() => {
                                    navigate("/register");
                                }}
                            >
                                Register
                            </button>
                        </p>
                    </div>
                </form>

                <div>
                    <img src={uno} alt="welcomeUNO" />
                </div>
            </div>
            <Toaster
                toastOptions={{
                    className: "",
                    style: {
                        border: "1px solid #713200",
                        padding: "32px",
                        color: "#713200",
                    },
                }}
            />
        </div>
    );
};
export default LoginForm;
