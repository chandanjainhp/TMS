import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const TeacherClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/teacher/my-classes", { withCredentials: true });
                if (response.data.success) {
                    setClasses(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch classes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your classes...</div>;

    if (classes.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Found</h3>
                <p className="text-gray-500 mb-6">You haven't uploaded any records yet. Upload records to see your classes here.</p>
                <Link to="/upload" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                    Upload Records <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{cls._id.subject}</h3>
                                <p className="text-gray-500 text-sm">{cls._id.department} - {cls._id.section} ({cls._id.year})</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center text-gray-500 text-sm" title="Total Records">
                                <Users className="w-4 h-4 mr-1.5" />
                                {cls.count} Records
                            </div>
                            <div className="flex items-center text-gray-400 text-xs" title="Last Updated">
                                <Clock className="w-3 h-3 mr-1" />
                                {cls.lastUpdate ? format(new Date(cls.lastUpdate), 'MMM d') : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TeacherClasses;
