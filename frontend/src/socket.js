// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false, // manually connect after login if needed
});

export default socket;