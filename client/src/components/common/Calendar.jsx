import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, X, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from "date-fns";
import toast from "react-hot-toast";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Form state
    const [newEvent, setNewEvent] = useState({
        title: "",
        type: "event",
        start: "",
        end: "",
        description: "",
        location: ""
    });

    const API_URL = "/api/events";

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL, { withCredentials: true });
            if (res.data.success) {
                setEvents(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(API_URL, newEvent, { withCredentials: true });
            if (res.data.success) {
                toast.success("Event created!");
                setEvents([...events, res.data.data]);
                setShowModal(false);
                setNewEvent({ title: "", type: "event", start: "", end: "", description: "", location: "" });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create event");
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const getEventsForDay = (date) => {
        return events.filter(event => isSameDay(parseISO(event.start), date));
    };

    const openModalForDate = (date) => {
        setSelectedDate(date);
        // Pre-fill date in form
        const dateStr = format(date, "yyyy-MM-dd");
        setNewEvent({ ...newEvent, start: `${dateStr}T09:00`, end: `${dateStr}T10:00` });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-indigo-600" />
                    Smart Schedule
                </h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="w-4 h-4" /> Add Event
                    </button>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full border border-gray-200"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="py-2 px-4 font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg min-w-[150px] text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full border border-gray-200"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr min-h-[500px]">
                    {/* Padding for start of month - simplified for now, usually needs logic to align day of week */}
                    {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-gray-50/30 border-b border-r border-gray-100 p-2" />
                    ))}

                    {daysInMonth.map((day, idx) => {
                        const dayEvents = getEventsForDay(day);
                        const isTodayDate = isToday(day);

                        return (
                            <div
                                key={idx}
                                onClick={() => openModalForDate(day)}
                                className={`min-h-[120px] border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition-colors cursor-pointer group ${!isSameMonth(day, currentDate) ? 'bg-gray-50/50 text-gray-400' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isTodayDate ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                                        {format(day, 'd')}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-indigo-100 rounded text-indigo-600 transition-opacity">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {dayEvents.map((event, i) => (
                                        <div
                                            key={i}
                                            className={`text-xs px-1.5 py-0.5 rounded truncate border-l-2
                                                ${event.type === 'exam' ? 'bg-red-50 text-red-700 border-red-500' :
                                                    event.type === 'class' ? 'bg-blue-50 text-blue-700 border-blue-500' :
                                                        'bg-green-50 text-green-700 border-green-500'}`}
                                            title={event.title}
                                        >
                                            {format(parseISO(event.start), 'HH:mm')} {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-indigo-600" /> New Event
                        </h3>

                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="e.g., Mathematics Exam"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={newEvent.type}
                                        onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="event">Event</option>
                                        <option value="class">Class</option>
                                        <option value="exam">Exam</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Room / Online"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.start}
                                        onChange={e => setNewEvent({ ...newEvent, start: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.end}
                                        onChange={e => setNewEvent({ ...newEvent, end: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    rows="3"
                                    placeholder="Add details..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                                >
                                    Save Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
