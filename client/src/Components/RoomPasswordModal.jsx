import { useContext } from "react";
import { MyContext } from "../context/context.js";

const RoomPasswordModal = () => {
    const { show, setShow, setPasswordCorrect, password } = useContext(MyContext);
    if (!show) {
        return null;
    }
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (e.target.roomPassword.value === password) {
            setPasswordCorrect(true);
        } else {
            alert("wrong password");
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded p-4 relative">
        <button
            onClick={() => setShow(false)}
            className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-900"
        >
            X
        </button>
        <h2 className="text-lg font-bold mb-2">Please Enter the Room Password</h2>
        <form onSubmit={handlePasswordSubmit} className="flex items-center">
            <input
                type="text"
                name="roomPassword"
                id="roomPassword"
                placeholder="Password..."
                className="border border-gray-300 rounded px-2 py-1 mr-2 focus:outline-none"
            />
            <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
                Join
            </button>
        </form>
    </div>
</div>
    );
};
export default RoomPasswordModal;
