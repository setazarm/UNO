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
        <div className="bg-gradient-to-br from-cyan-300 via-cyan-500 to-cyan-700 h-full flex flex-col justify-center items-center p-6">
            <form
                onSubmit={submitHandler}
                className="flex flex-col  p-6 outline-double outline-2 rounded "
            >
                <h2 className="text-center">Register</h2>
                <label htmlFor="name">Name: </label>
                <input
                    className="outline-double outline-2 outline-gray-500 my-2 px-1"
                    type="text"
                    name="name"
                />

                <label htmlFor="email">Email: </label>
                <input
                    className="outline-double outline-2 outline-gray-500 my-2 px-1"
                    type="email"
                    name="email"
                />

                <label htmlFor="password">Password: </label>
                <input
                    className="outline-double outline-2 outline-gray-500 my-2 px-1"
                    type="password"
                    name="password"
                />

                {error && <p>{error}</p>}
                <button
                    className="
                 text-gray-100
                 bg-blue-500
                 p-2
                 my-2
                 rounded-sm
                 hover:bg-blue-700
                 "
                >
                    Submit
                </button>
            </form>
            <div className=" my-2">
                <p>
                    Already have an account?
                    <button
                     className="
                     text-white
                     hover:text-blue-700
                     mx-2
                     "
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};
export default RegisterForm;
