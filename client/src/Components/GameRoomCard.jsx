const GameRoomCard = ({ room, setShow }) => {
    return (
        <div className="border-gray-700 rounded-sm border-2 mb-1 w-32">
            <h2>{room.roomName}</h2>
            <h3>{room.players.length} / 4 Players</h3>
            <h3>Password needed: {room.password ? "Yes" : "No"}</h3>
            <button
                className="border-2 border-black rounded-md p-1"
                onClick={() => (room.password ? setShow(true) : null)}
            >
                Join
            </button>
        </div>
    );
};
export default GameRoomCard;
