// admin.controller.js
const AdminModel = require('../models/admin.model');
const AuthModel = require('../models/auth.model'); // Assuming your user model
const BlogModel = require('../models/blog.model');
const jwt = require('../services/jwt.service');

const adminController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check if admin with this email already exists
        const existingAdmin = await AdminModel.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate email format (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create new admin
        const newAdmin = new AdminModel({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // Will be hashed by the pre-save middleware
            role: 'admin',
            isActive: true
        });

        // Save admin to database
        const savedAdmin = await newAdmin.save();

        // Generate JWT token for the newly created admin
        const tokenPayload = {
            id: savedAdmin._id,
            email: savedAdmin.email,
            role: savedAdmin.role,
            type: 'admin'
        };

        const token = jwt.generateToken(tokenPayload);

        // Return success response (exclude password from response)
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                admin: {
                    id: savedAdmin._id,
                    name: savedAdmin.name,
                    email: savedAdmin.email,
                    role: savedAdmin.role,
                    isActive: savedAdmin.isActive,
                    createdAt: savedAdmin.createdAt
                },
                token
            }
        });

    } catch (error) {
        // Handle duplicate email error (MongoDB unique constraint)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Handle other errors
        console.error('Error creating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while creating admin',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
const adminLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find admin by email
        const admin = await AdminModel.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if admin account is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Admin account is deactivated'
            });
        }

        // Check if account is locked
        if (admin.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account temporarily locked due to failed login attempts. Please try again later.'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            // Increment login attempts
            await admin.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Reset login attempts and update last login
        await AdminModel.updateOne(
            { _id: admin._id },
            {
                $unset: { loginAttempts: 1, lockUntil: 1 },
                $set: { lastLogin: new Date() }
            }
        );

        // Generate JWT token
        const tokenPayload = {
            id: admin._id,
            email: admin.email,
            role: admin.role,
            type: 'admin'
        };

        const token = jwt.generateToken(tokenPayload);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    lastLogin: admin.lastLogin
                },
                token
            }
        });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    adminController,
    adminLoginController
};