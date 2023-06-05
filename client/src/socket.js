import io from "socket.io-client";

export const socket = io("https://uno-5dzs.onrender.com", { autoConnect: true });
//export const socket = io("http://localhost:8000", { autoConnect: true });
