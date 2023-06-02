import { body, validationResult } from "express-validator";

export const validateRegister = [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("name").notEmpty().withMessage("Name is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    },
];

export const validateLogin = [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").trim().notEmpty().withMessage("Please enter your password"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        next();
    },
];
