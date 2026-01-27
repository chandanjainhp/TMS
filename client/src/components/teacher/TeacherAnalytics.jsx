import { BarChart2, TrendingUp, Users } from "lucide-react";

const TeacherAnalytics = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-indigo-600" />
                Advanced Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Attendance</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">85%</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Class Performance</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">B+</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500">Detailed class-wise analytics module loading...</p>
            </div>
        </div>
    );
};

export default TeacherAnalytics;
