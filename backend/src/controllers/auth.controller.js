require('dotenv').config();
const AuthModel = require('../models/auth.model');
const { generateToken } = require('../services/jwt.service');
const bcrypt = require('bcryptjs');



const signupController = async (req, res) => {
  try {
    const { username, fullName, password } = req.body;

    // Basic validation
    if (!username || !fullName || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, fullName, and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await AuthModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already taken"
      });
    }

    // Create new user
    const newUser = new AuthModel({ username, fullName, password }); // password will be hashed in model
    await newUser.save();

    // Generate JWT token
    const token = generateToken({
      id: newUser._id,
      username: newUser.username,
      role: newUser.role
    });

    // Response
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    console.error("Error in signupController:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const signinController = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate inputs
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Check if user exists - FIXED: AuthModel instead of Auth
        const user = await AuthModel.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Your username or password is incorrect"
            });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Your username or password is incorrect"
            });
        }

        // Generate token
        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.role
        });

        // Respond with user info and token
        res.status(200).json({
            success: true,
            message: "Signin successful",
            user: {
                username: user.username,
                fullName: user.fullName,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error("Error in signinController:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    signupController,
    signinController
}