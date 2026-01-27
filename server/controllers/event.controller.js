import { Event } from "../models/event.model.js";

export const getEvents = async (req, res) => {
    try {
        // Fetch all events for now. In real app, filter by department/user.
        const events = await Event.find().sort({ start: 1 });
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, type, start, end, description, location, department } = req.body;

        if (!title || !start || !end) {
            return res.status(400).json({ success: false, message: "Title, Start, and End are required" });
        }

        const newEvent = new Event({
            title,
            type,
            start,
            end,
            description,
            location,
            department,
            createdBy: req.userId // Assuming verifiedToken middleware adds this
        });

        await newEvent.save();

        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Failed to create event" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ success: false, message: "Failed to delete event" });
    }
};
