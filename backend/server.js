import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config.js";



// Load environment variables
dotenv.config();
const port = 4000

// App configuration
const app = express();

// Middleware configuration
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Database connection
connectDB(process.env.MONGO_URI);

// Static files
app.use("/images", express.static("uploads"));

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.send("API is working");
});

// Additional example: Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
    });
});

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})
