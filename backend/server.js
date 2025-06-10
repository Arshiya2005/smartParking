import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import userRoutes from "./routes/userRoutes.js"; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev")); // logs requests

app.use("/test", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello !!")
})

app.listen(PORT, () => {
    console.log("Server is running of " + PORT)
}) 