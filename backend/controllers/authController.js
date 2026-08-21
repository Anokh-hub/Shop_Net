const User = require("../model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail')

const generateToken = (id) => {
    console.log("JWT inside generateToken:", process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

//Register a new user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exits' });
        }
        //password ko incrpt karna aur hash karna 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        //otp generate karna 
        if (user) {
            const otp = Math.floor(1000000 + Math.random() * 9000000).toString();

            const message = `
            Welcome to ShopNet, ${name}! Thankyou for registrating withus.
            Your OTP for ShopNet registration is :${otp}`;
            await sendEmail(email, 'Welcome to ShopNest - Your OTP for Registration', message);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//login user 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// getUsetr 

const getUsers = async (req, res) => {
    try {
        const user = await User.find({}).select('-password');
        res.json(getUsers)
    }
    catch (error) {
        res.status(500).json({ message: "server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
}