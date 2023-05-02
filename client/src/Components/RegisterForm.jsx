import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const submitHandler = (e) => {
        const user = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };
        e.preventDefault();
        axios
            .post("http://localhost:8000/users", JSON.stringify(user), {
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
                if (res.data.success) {
                    navigate("/");
                } else {
                    setError(res.data.error);
                }
            })
            .catch((error) => {
                setError(error.response.data.error);
            });
    };
    return (
        <form onSubmit={submitHandler}>
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" />

            <label htmlFor="email">Email: </label>
            <input type="email" name="email" />

            <label htmlFor="password">Password: </label>
            <input type="password" name="password" />

            {error && <p>{error}</p>}
            <button>Submit</button>
        </form>
    );
};
export default RegisterForm;
