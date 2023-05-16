import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import httpErrors from "http-errors";
export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        next(new httpErrors.InternalServerError(err.message));
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
    } catch (err) {
        next(new httpErrors.NotFound(err.message));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByID(id);
        res.json({ success: true, data: user });
    } catch (err) {
        next(new httpErrors.NotFound("No record found !"));
    }
};

export const verify = async (req, res, next) => {
    try {
        //console.log('here',req.user);
        res.json({ success: true, data: req.user });
    } catch (err) {
        next(new httpErrors.NotFound("No record found !"));
    }
};

export const getAllUsers = async (_, res, next) => {
    try {
        const users = await User.find();
        res.json({ success: true, data: users });
    } catch (err) {
        next(new httpErrors.InternalServerError("Please try again in few minutes !"));
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({ success: true, data: updatedUser });
    } catch (err) {
        next(new httpErrors.NotFound("No record found !"));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndRemove(id);
        res.json({ success: true, data: deletedUser });
    } catch (err) {
        next(new httpErrors.NotFound("No record found !"));
    }
};
