import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {validateRegisterInput, validateLoginInput} from "../utils/validate.js";
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

export const register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    const validationError = validateRegisterInput(name, email, phone, password);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await hashPassword(password);
        const user = new User({ name, email, phone, password: hashedPassword });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const validationError = validateLoginInput(email, password);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

