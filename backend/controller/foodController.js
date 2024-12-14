import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add a new food item
const addFood = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: "All fields (name, description, price, category) are required",
            });
        }

        const food = new foodModel({
            name,
            description,
            price: parseFloat(price),
            category,
            image: req.file.filename,
        });

        await food.save();

        return res.status(201).json({
            success: true,
            message: "Food item added successfully",
            data: food,
        });
    } catch (error) {
        console.error("Error adding food:", error);
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get all food items
const getAllFoods = async (req, res) => {
    try {
        const foods = await foodModel.find();
        return res.status(200).json({
            success: true,
            message: "Food items retrieved successfully",
            data: foods,
        });
    } catch (error) {
        console.error("Error retrieving food items:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get a specific food item by ID
const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Food item retrieved successfully",
            data: food,
        });
    } catch (error) {
        console.error("Error retrieving food item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update a food item
const updateFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        // Update fields
        const { name, description, price, category } = req.body;
        if (req.file) {
            // Delete old image file if a new one is uploaded
            if (food.image) fs.unlinkSync(`uploads/${food.image}`);
            food.image = req.file.filename;
        }
        if (name) food.name = name;
        if (description) food.description = description;
        if (price) food.price = parseFloat(price);
        if (category) food.category = category;

        await food.save();

        return res.status(200).json({
            success: true,
            message: "Food item updated successfully",
            data: food,
        });
    } catch (error) {
        console.error("Error updating food item:", error);
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Delete a food item
const deleteFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        // Delete image file
        if (food.image) fs.unlinkSync(`uploads/${food.image}`);

        await foodModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Food item deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting food item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Export all endpoints
export { addFood, getAllFoods, getFoodById, updateFood, deleteFood };
