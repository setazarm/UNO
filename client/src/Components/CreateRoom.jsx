import { useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { MyContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
    const { user, rooms } = useContext(MyContext);
    const [selectedColor, setSelectedColor] = useState('#f55142');
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
          case '#f55142':
            return 'text-red-500';
          case '#428af5':
            return 'text-blue-500';
          case '#f5da42':
            return 'text-yellow-500';
          case '#07b825':
            return 'text-green-500';
          case '#010101':
            return 'text-black';
          default:
            return 'text-black';
        }
      };
      const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
      };
      
  const selectStyle = {
    backgroundColor: selectedColor,
  };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-300 via-green-500 to-green-600 ">
        <form onSubmit={createRoom} className="w-full max-w-sm bg-white rounded-lg p-6">
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
                selectedColor === '#010101' ? 'text-white' : 'text-black'
              }`}
              style={selectStyle}
              onChange={handleColorChange}
            >
              <option
                value="#f55142"
                className={`bg-red-100 ${getOptionTextColor('#f55142')} ${
                  selectedColor === '#f55142' ? 'font-bold' : ''
                }`}
              >
                Red
              </option>
              <option
                value="#428af5"
                className={`bg-blue-100 ${getOptionTextColor('#428af5')} ${
                  selectedColor === '#428af5' ? 'font-bold' : ''
                }`}
              >
                Blue
              </option>
              <option
                value="#f5da42"
                className={`bg-yellow-100 ${getOptionTextColor('#f5da42')} ${
                  selectedColor === '#f5da42' ? 'font-bold' : ''
                }`}
              >
                Yellow
              </option>
              <option
                value="#07b825"
                className={`bg-green-100 ${getOptionTextColor('#07b825')} ${
                  selectedColor === '#07b825' ? 'font-bold' : ''
                }`}
              >
                Green
              </option>
              <option
                value="#010101"
                className={`bg-black ${getOptionTextColor('#010101')} ${
                  selectedColor === '#010101' ? 'font-bold text-white' : ''
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
