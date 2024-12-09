import foodModel from "../models/foodModel.js";
import fs from 'fs';

const addFood = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded. Please upload an image file.",
            });
        }

        // Log the request data for debugging
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        // Validate required fields
        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, description, price, category) are required",
            });
        }

        // Save the food item to the database
        let image_filename = `${req.file.filename}`; // Uploaded file name
        const food = new foodModel({
            name,
            description,
            price,
            category,
            image: image_filename,
        });

        await food.save();

        return res.status(201).json({
            success: true,
            message: "Food item added successfully",
            data: food,
        });
    } catch (error) {
        console.error("Error adding food:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export { addFood };
