import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Megaphone, Calendar } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const TeacherAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        department: "",
        section: "",
        subject: ""
    });

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get("/api/teacher/announcements", { withCredentials: true });
            if (response.data.success) {
                setAnnouncements(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/teacher/announcements", newAnnouncement, { withCredentials: true });
            if (response.data.success) {
                toast.success("Announcement posted!");
                setNewAnnouncement({ title: "", content: "", department: "", section: "", subject: "" });
                setShowForm(false);
                fetchAnnouncements();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post announcement");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <Megaphone className="w-5 h-5 text-indigo-600" /> Announcements
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Announcement
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            className="bg-white border rounded-lg p-3 w-full"
                            placeholder="Title"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            required
                        />
                        <input
                            className="bg-white border rounded-lg p-3 w-full"
                            placeholder="Department (e.g. CSE)"
                            value={newAnnouncement.department}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, department: e.target.value })}
                        />
                        <input
                            className="bg-white border rounded-lg p-3 w-full"
                            placeholder="Section (e.g. A)"
                            value={newAnnouncement.section}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, section: e.target.value })}
                        />
                        <input
                            className="bg-white border rounded-lg p-3 w-full"
                            placeholder="Subject (Optional)"
                            value={newAnnouncement.subject}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, subject: e.target.value })}
                        />
                    </div>
                    <textarea
                        className="bg-white border rounded-lg p-3 w-full mb-4 h-24"
                        placeholder="Announcement Content..."
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Post
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {loading ? (
                    <p className="text-gray-500 text-center py-4">Loading announcements...</p>
                ) : announcements.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No announcements yet.</p>
                ) : (
                    announcements.map((ann) => (
                        <div key={ann._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(ann.createdAt), "MMM d, yyyy")}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{ann.content}</p>
                            <div className="mt-2 flex gap-2">
                                {ann.department && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">{ann.department}</span>}
                                {ann.section && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">Sec: {ann.section}</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherAnnouncements;
