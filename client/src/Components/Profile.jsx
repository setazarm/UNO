import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillCloseSquare } from "react-icons/ai";
import { MyContext } from "../context/context.js";

const Profile = ({ setIsloading }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const { user, setUser } = useContext(MyContext);
    const [showDeletePopup, setShowDeletePopup] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
    }, []);

    const deleteUser = () => {
      setShowDeletePopup(true); // Show the delete popup
  };

  const confirmDelete = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      axios
          .delete(`/users/${user._id}`, {
              headers: {
                  token: token,
              },
          })
          .then(() => {
              setUser({});
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
          })
          .catch((err) => {
              console.log(err);
          });
  };

  const cancelDelete = () => {
      setShowDeletePopup(false); // Hide the delete popup
  };
    const getImage = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setUpdatedUser({ ...updatedUser, Avatar: reader.result.toString() });
        };
    };

    const editHandler = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const data = new FormData();

        if (updatedUser.name) {
            data.append("name", updatedUser.name);
        }
        if (updatedUser.email) {
            data.append("email", updatedUser.email);
        }
        if (updatedUser.status) {
            data.append("status", updatedUser.status);
        }
        if (updatedUser.Avatar) {
            data.append("Avatar", updatedUser.Avatar);
        }

        axios
            .patch(`/users/${user._id}`, data, {
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
        <div className="bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 min-h-screen flex flex-col font-mono p-6">
            <div className="flex justify-center">
                <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center mb-6">
                        <img
                            src={user?.Avatar}
                            alt={user?.name}
                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-4"
                        />
                        <div>
                            <h1 className="text-4xl font-bold">{user?.name}</h1>
                            <p className="text-lg text-gray-600">{user?.email}</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">Profile Information</h2>
                        <div className="border-t border-gray-200 mt-2" />
                        <p className="text-lg mt-4">
                            <span className="font-bold">Points:</span> {user?.points}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Status:</span> {user?.status}
                        </p>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold">People who liked you</h2>
                        <div className="border-t border-gray-200 mt-2" />
                        <div className="mt-4">
                            {user?.likes?.map((like, i) => (
                                <p key={i} className="text-lg">
                                    {like.name}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-300 to-transparent h-6" />
                </div>
            </div>
            <div className="absolute right-2 sm:right-[20vw] flex flex-col sm:flex-col sm:justify-end mt-3">
                <button
                    className="bg-gradient-to-br from-green-300 via-green-500 to-green-700 text-white font-bold py-2 px-4 rounded my-1 sm:mx-2 text-sm sm:text-base"
                    onClick={() => {
                        setIsEditing(true);
                    }}
                >
                    Edit Profile
                </button>
                <button
                    className="bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded my-1 sm:mx-2 text-sm sm:text-base"
                    onClick={() => {
                        setIsloading((prev) => !prev);
                        localStorage.removeItem("token");
                        localStorage.removeItem('user')
                        navigate("/");
                    }}
                >
                    Logout
                </button>
                <button
                    className="bg-gradient-to-br from-red-300 via-red-500 to-red-700 text-white font-bold py-2 px-4 rounded my-1 sm:mx-2 text-sm sm:text-base"
                    onClick={() => {
                        deleteUser();
                    }}
                >
                    Delete Profile
                </button>
                {
                    showDeletePopup && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white w-full md:w-1/2 rounded-lg shadow-lg p-6 relative overflow-hidden">
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDeletePopup(false);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
                                    >
                                        <AiFillCloseSquare size={30} />
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-700 font-bold mb-2">
                                        Are you sure you want to delete your profile?
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        className="bg-gradient-to-br from-red-300 via-red-500 to-red-700 text-white font-bold py-2 px-4 rounded my-1 sm:mx-2 text-sm sm:text-base"
                                        onClick={() => {
                                            confirmDelete()
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bg-gradient-to-br from-green-300 via-green-500 to-green-700 text-white font-bold py-2 px-4 rounded my-1 sm:mx-2 text-sm sm:text-base"
                                        onClick={() => {

                                            cancelDelete()
                                        }}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    )
                }
            </div>

            {isEditing && (
                <div className="flex justify-center mt-5">
               <form onSubmit={editHandler} className="bg-white w-full md:w-1/2 rounded-lg shadow-lg p-6 relative overflow-hidden">
               <div className="flex justify-end">
                 <button
                   type="button"
                   onClick={() => {
                     setIsEditing(false);
                   }}
                   className="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
                 >
                   <AiFillCloseSquare size={30} />
                 </button>
               </div>
               <div className="mb-4">
                 <label className="text-gray-700 font-bold mb-2" htmlFor="name">
                   Name
                 </label>
                 <input
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="name"
                   name="name"
                   type="text"
                   placeholder="Enter your name"
                   value={updatedUser.name}
                   onChange={(e) => {
                     setUpdatedUser({ ...updatedUser, name: e.target.value });
                   }}
                 />
               </div>
               <div className="mb-4">
                 <label className="text-gray-700 font-bold mb-2" htmlFor="email">
                   Email
                 </label>
                 <input
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="email"
                   name="email"
                   type="email"
                   placeholder="Enter your email"
                   value={updatedUser.email}
                   onChange={(e) => {
                     setUpdatedUser({ ...updatedUser, email: e.target.value });
                   }}
                 />
               </div>
               <div className="mb-4">
                 <label className="text-gray-700 font-bold mb-2" htmlFor="status">
                   Status
                 </label>
                 <input
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="status"
                   name="status"
                   type="text"
                   placeholder="Enter your new status"
                   value={updatedUser.status}
                   onChange={(e) => {
                     setUpdatedUser({ ...updatedUser, status: e.target.value });
                   }}
                 />
               </div>
               <div className="mb-4">
                 <label className="text-gray-700 font-bold mb-2" htmlFor="file">
                   Profile Picture
                 </label>
                 <input
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   name="file"
                   type="file"
                   placeholder="Upload your profile picture"
                   onChange={(e) => {
                     getImage(e.target.files[0]);
                     setUpdatedUser({ ...updatedUser, Avatar: e.target.files[0] });
                   }}
                 />
               </div>
               <div className="flex items-center justify-between">
                 <button
                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                   type="submit"
                 >
                   Save Changes
                 </button>
               </div>
             </form>
             </div> 
            )}
        </div>
    );
};

export default Profile;
