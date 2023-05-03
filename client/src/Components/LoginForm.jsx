import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LoginForm = ({
   
    setIsloading
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password,
        };
        axios
            .post("http://localhost:8000/users/login", data)
            .then((res) => {
                localStorage.setItem("token", res.headers.token);
                localStorage.setItem("user", JSON.stringify(res.data.data))
                setIsloading(true)
                navigate("/profile");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/profile");
        }
    }, []);
    return (
        <div>
            <h1>Login Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
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
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button type="submit">Login</button>
            </form>
            <div>
                <p>
                    Do not have an account?
                    <button
                        onClick={() => {
                            navigate("/register");
                        }}
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};
export default LoginForm;
