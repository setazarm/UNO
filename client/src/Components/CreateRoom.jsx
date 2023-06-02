import { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { MyContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
    const { user, rooms } = useContext(MyContext);
    const [selectedColor, setSelectedColor] = useState("#f55142");
    const navigate = useNavigate();
    const createRoom = (e) => {
        e.preventDefault();
        socket.emit("create_room", {
            roomName: e.target.room.value,
            password: e.target.password.value,
            userId: user._id,
            bgColor: e.target["bg-color"].value,
        });
    };

    useEffect(() => {
        const room = rooms.find((room) => {
            return room.userId.toString() === user._id.toString() ? room : null;
        });

        if (room) {
            socket.emit("join_room", { userId: user._id, roomId: room._id });
            navigate(`/game/${room._id}`);
        }
    }, [rooms]);
    const getOptionTextColor = (value) => {
        switch (value) {
            case "#f55142":
                return "text-red-500";
            case "#428af5":
                return "text-blue-500";
            case "#f5da42":
                return "text-yellow-500";
            case "#07b825":
                return "text-green-500";
            case "#010101":
                return "text-black";
            default:
                return "text-black";
        }
    };
    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };

    const selectStyle = {
        backgroundColor: selectedColor,
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundColor: "#DEFFFA",
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='1' y2='0'%3E%3Cstop offset='0' stop-color='%230FF'/%3E%3Cstop offset='1' stop-color='%2359BB45'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23F00'/%3E%3Cstop offset='1' stop-color='%23FFFC10'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23FFF' fill-opacity='0' stroke-miterlimit='10'%3E%3Cg stroke='url(%23a)' stroke-width='2'%3E%3Cpath transform='translate(0 0)' d='M1409 581 1450.35 511 1490 581z'/%3E%3Ccircle stroke-width='4' transform='rotate(0 800 450)' cx='500' cy='100' r='40'/%3E%3Cpath transform='translate(0 0)' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'/%3E%3C/g%3E%3Cg stroke='url(%23b)' stroke-width='4'%3E%3Cpath transform='translate(0 0)' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'/%3E%3Crect stroke-width='8' transform='rotate(0 1089 759)' x='1039' y='709' width='100' height='100'/%3E%3Cpath transform='rotate(0 1400 132)' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
            }}
        >
            <form onSubmit={createRoom} className="w-full max-w-sm bg-[#0d6fa3] rounded-lg p-6">
                <div className="mb-4">
                    <label htmlFor="room" className="block mb-2 font-bold">
                        Room Name
                    </label>
                    <input
                        type="text"
                        name="room"
                        id="room"
                        placeholder="Room name"
                        className="p-2 rounded border w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 font-bold">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        className="p-2 rounded border w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="bg-color" className="block mb-2 font-bold">
                        Choose a table color
                    </label>
                    <select
                        name="bg-color"
                        id="bg-color"
                        className={`p-2 pr-10 rounded border appearance-none ${
                            selectedColor === "#010101" ? "text-white" : "text-black"
                        }`}
                        style={selectStyle}
                        onChange={handleColorChange}
                    >
                        <option
                            value="#f55142"
                            className={`bg-red-100 ${getOptionTextColor("#f55142")} ${
                                selectedColor === "#f55142" ? "font-bold" : ""
                            }`}
                        >
                            Red
                        </option>
                        <option
                            value="#428af5"
                            className={`bg-blue-100 ${getOptionTextColor("#428af5")} ${
                                selectedColor === "#428af5" ? "font-bold" : ""
                            }`}
                        >
                            Blue
                        </option>
                        <option
                            value="#f5da42"
                            className={`bg-yellow-100 ${getOptionTextColor("#f5da42")} ${
                                selectedColor === "#f5da42" ? "font-bold" : ""
                            }`}
                        >
                            Yellow
                        </option>
                        <option
                            value="#07b825"
                            className={`bg-green-100 ${getOptionTextColor("#07b825")} ${
                                selectedColor === "#07b825" ? "font-bold" : ""
                            }`}
                        >
                            Green
                        </option>
                        <option
                            value="#010101"
                            className={`bg-black ${getOptionTextColor("#010101")} ${
                                selectedColor === "#010101" ? "font-bold text-white" : ""
                            }`}
                        >
                            Black
                        </option>
                    </select>
                </div>
                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    Create a Room
                </button>
            </form>
        </div>
    );
};

export default CreateRoom;
