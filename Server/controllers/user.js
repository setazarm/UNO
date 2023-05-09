import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.SIGNATURE
        );

        res.header("token", token).status(200).json({ success: true, data: existingUser });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user) {
            res.json({ success: true, data: user });
        } else {
            res.json({ success: false, message: "please provide valid id" });
        }
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        res.json({ success: true, data: deletedUser });
    } catch (error) {
        next(error);
    }
};
