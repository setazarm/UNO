import io from "socket.io-client";
import {config} from "./config";
console.log(process.env.NODE_ENV)
export const socket = io(config.server, { autoConnect: true });
//export const socket = io("http://localhost:8000", { autoConnect: true });
