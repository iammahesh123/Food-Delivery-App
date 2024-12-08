import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"

//app configuration
const app = express()
const port = 4000

//middleware configuration
app.use(express.json())
app.use(cors())

//Database connection
connectDB();

// API Endpoints
app.use("/api/food",foodRouter)

app.get("/",(req,res)=> {
    res.send("API working")

})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})