import { getCalendarEvents } from "../services/calendarService.js";

export const fetchCalendarEvents = async (req, res) => {
    try {
        const events = await getCalendarEvents();
        res.json(events);
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        res.status(500).json({ message: "Failed to fetch calendar events." });
    }
};
