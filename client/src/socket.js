import io from "socket.io-client";

export const socket = io("https://uno-5dzs.onrender.com", { autoConnect: true });
