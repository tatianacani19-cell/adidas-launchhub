import { Router } from "express";
import { fetchCalendarEvents } from "../controllers/calendarController.js";

const router = Router();

router.get("/", fetchCalendarEvents);

export default router;
