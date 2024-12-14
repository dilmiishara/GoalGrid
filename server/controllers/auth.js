import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export async function register(req, res, next) {
    const data = req.body;
    console.log(data);

    if (!data?.email || !data?.password) {
        return next(createError(400, "Missing fields"));
    }

    await connectToDB();

    const alreadyRegistered = await User.exists({ email: data.email });
    if (alreadyRegistered) return next(createError(400, "User already exists."));

    // Fix: Use bcrypt.genSaltSync(10) instead of bcrypt.getSaltSync(10)
    const salt = bcrypt.genSaltSync(10);  // Updated line
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();  // Save the new user to the database

    res.status(201).json("User created successfully");  // Respond with the newly created user
}

export async function login(req, res, next) {
    // Login logic goes here
}

export async function logout(req, res, next) {
    // Logout logic goes here
}
