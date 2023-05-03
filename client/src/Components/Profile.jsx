import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            localStorage.removeItem("token");
            navigate("/");
            return;
        }

        axios
            .get(`http://localhost:8000/users/${user._id}`, {
                headers: {
                    token: token,
                },
            })
            .then((res) => {
                setUser(res.data.data);
            })
            .catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
            });
    }, []);

    const deleteUser = () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        axios
            .delete(`http://localhost:8000/users/${user._id}`, {
                headers: {
                    token: token,
                },
            })
            .then(() => {
                setUser({});
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const editHandler = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        axios
            .patch(`http://localhost:8000/users/${user._id}`, updatedUser, {
                headers: {
                    token: token,
                },
            })
            .then((res) => {
                setUser(res.data.data);
                setIsEditing(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            <h1>Profile</h1>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Points: {user.points}</p>
            <img src={user.Avatar} alt={user.name} style={{ width: "200px", height: "200px" }} />
            <p>Status: {user.status}</p>
            <p> Number of played games {user.numOfPlayedGames} </p>
            <button
                onClick={() => {
                    setIsEditing(true);
                }}
            >
                Edit Profile
            </button>
            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                }}
            >
                Logout
            </button>
            <button
                onClick={() => {
                    deleteUser();
                }}
            >
                Delete Profile
            </button>

            {isEditing && (
                <form onSubmit={editHandler}>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                        }}
                    >X</button>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        onChange={(e) => {
                            setUpdatedUser({ ...updatedUser, name: e.target.value });
                        }}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={(e) => {
                            setUpdatedUser({ ...updatedUser, email: e.target.value });
                        }}
                    />
                    <label htmlFor="status">Status</label>
                    <input
                        type="text"
                        id="status"
                        name="status"
                        placeholder="Enter your new status"
                        onChange={(e) => {
                            setUpdatedUser({ ...updatedUser, status: e.target.value });
                        }}
                    />
                    <button type="submit">submit</button>
                </form>
            )}
        </div>
    );
};

export default Profile;
