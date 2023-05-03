const RoomPasswordModal = ({ show, setShow }) => {
    if (!show) {
        return null;
    }
    return (
        <div>
            <button onClick={() => setShow(false)}>X</button>
            <h2>Please enter the room password</h2>
            <input type="text" name="roomPassword" id="roomPassword" placeholder="password..." />
            <button>Join</button>
        </div>
    );
};
export default RoomPasswordModal;
