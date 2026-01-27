import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getEvents, createEvent, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", verifyToken, getEvents);
router.post("/", verifyToken, createEvent);
router.delete("/:id", verifyToken, deleteEvent);

export default router;
