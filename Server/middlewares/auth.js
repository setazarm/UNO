import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
export const auth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const payload = jwt.verify(token, process.env.SIGNATURE);
        const user = await User.findById(payload.id).populate("likes");
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
