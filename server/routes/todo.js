import express from "express";
import { getAllTodos, updateTodo, deleteTodo, getTodo, addTodo } from "../controllers/todo.js";

const router = express.Router();

router.get("/",getAllTodos);
router.post("/",addTodo);
router.put("/:id",updateTodo);
router.get("/:id",getTodo);
router.delete("/:id",deleteTodo);

export default router;