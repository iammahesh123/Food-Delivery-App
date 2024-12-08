import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://mahesh:pOz6XOciNGC2vZl0@cluster0.rfjdm.mongodb.net/food-delivery?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};


    

