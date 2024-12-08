import express from "express"
import cors from "cors"

//app configuration
const app = express()
const port = 4000

//middleware configuration
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=> {
    res.send("API working")

})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})

//mongodb+srv://mahesh:password@123@cluster0.rfjdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0