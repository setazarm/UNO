import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LoginForm = () => {
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
                navigate("/profile");
            })
            .catch((err) => {
                console.log(err);
            });
    };
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
                    value={email}
                    onChange={setEmail}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={setPassword}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
export default LoginForm;
