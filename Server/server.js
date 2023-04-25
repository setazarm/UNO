import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
dotenv.config();
const app = express();
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", exposedHeaders: ["token"] }))
mongoose
    .connect(
        process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true },
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Database connected! '))
    .catch((err) => console.log('Database is not connected! ', err.message));
app.listen(8000, () => console.log(`The server is listening on port ${process.env.PORT}`));