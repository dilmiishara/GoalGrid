import express from "express";
import AuthRoute from "./routes/auth.js";
import TodoRoute from "./routes/todo.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDB } from "./utils/connect.js";
import cookieParser from "cookie-parser";

const app= express();
const PORT=3000;

dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/user",AuthRoute);
app.use("/api/todos",TodoRoute);

app.get("/",(req,res,next)=>{
    res.send("hello world");
});

//global error handler

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({error: message});
});

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
    connectToDB()
});