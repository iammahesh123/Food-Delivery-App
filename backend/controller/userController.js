import  userModel  from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error raised" });
    }
};

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export { loginUser, registerUser };
