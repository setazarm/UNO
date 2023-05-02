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
        <>
            <form onSubmit={submitHandler} className="flex flex-col">
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" className="border-solid border-2 black" />

                <label htmlFor="email">Email: </label>
                <input type="email" name="email" className="border-solid border-2 black" />

                <label htmlFor="password">Password: </label>
                <input type="password" name="password" className="border-solid border-2 black" />

                {error && <p>{error}</p>}
                <button>Submit</button>
            </form>
            <div>
                <p>
                    Already have an account?
                    <button
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </>
    );
};
export default RegisterForm;
