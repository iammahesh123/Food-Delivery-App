import express from "express";
import multer from "multer";
import {
    addFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood,
} from "../controller/foodController.js";

const foodRouter = express.Router();

// Image Storage Engine
const Storage = multer.diskStorage({
    destination: "uploads", // Ensure this folder exists
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: Storage });

// Add a new food item
foodRouter.post("/add", upload.single("image"), addFood);

// Get all food items
foodRouter.get("/", getAllFoods);

// Get a specific food item by ID
foodRouter.get("/:id", getFoodById);

// Update a specific food item (with optional new image upload)
foodRouter.put("/:id", upload.single("image"), updateFood);

// Delete a specific food item
foodRouter.delete("/:id", deleteFood);

export default foodRouter;
