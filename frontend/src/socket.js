// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,  // if using cookies/auth
  autoConnect: false,     // you control when to connect
});

export default socket;