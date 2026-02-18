import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Building2,
    Users2,
    GraduationCap,
    Upload,
    FileSpreadsheet,
    LogOut,
    Settings,
    Menu,
    X,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    Loader
} from "lucide-react";
import { useAdminAuthStore } from "../store/adminAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

const PrincipalDashboardPage = () => {
    // Principal uses adminAuthStore or a dedicated store in future
    // For now assuming Principal logs in via Admin portal but has 'principal' role
    const { admin, logout: adminLogout } = useAdminAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStats, setUploadStats] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        deptCount: 0,
        facultyCount: 0,
        studentCount: 0,
        avgAttendance: "0%"
    });

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/principal/stats');
            if (res.data.success) {
                setDashboardStats(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleLogout = async () => {
        await adminLogout();
        navigate('/admin-login');
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        setUploadStats(null);
        const toastId = toast.loading("Processing Master Data...");

        try {
            const response = await axios.post("/api/principal/upload-master", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success(response.data.message, { id: toastId });
                setUploadStats(response.data.stats);
                fetchStats(); // Refresh counters
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Upload failed", { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const statsCards = [
        { label: "Total Departments", value: dashboardStats.deptCount, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Faculty", value: dashboardStats.facultyCount, icon: Users2, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Enrolled Scholars", value: dashboardStats.studentCount, icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Avg Attendance", value: dashboardStats.avgAttendance, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-64 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Building2 className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 leading-tight">EduNexus</h2>
                        <p className="text-xs text-indigo-600 font-medium tracking-wideToUpper">PRINCIPAL OFFICE</p>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <button className="flex items-center w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium transition-colors">
                        <Building2 className="w-5 h-5 mr-3" />
                        Dashboard
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Users2 className="w-5 h-5 mr-3" />
                        Faculty Directory
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <GraduationCap className="w-5 h-5 mr-3" />
                        Student Master
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Settings className="w-5 h-5 mr-3" />
                        System Settings
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-gray-600" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">Institution Overview</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{admin?.name || 'Principal'}</p>
                            <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
                            <span className="font-bold text-indigo-700">PR</span>
                        </div>
                    </div>
                </header>

                <div className="p-6 max-w-7xl mx-auto space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsCards.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Actions Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT: Bulk Upload (Principal Special) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                                        Master Student Data Import
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Upload the academic year's student roster. This will automatically populate departments and branches.
                                    </p>

                                    {uploadStats && (
                                        <div className="mt-4 flex gap-4 text-sm">
                                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Created: {uploadStats.created}</span>
                                            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Updated: {uploadStats.updated}</span>
                                            {uploadStats.failed > 0 && <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Failed: {uploadStats.failed}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    {/* Invisible File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept=".xlsx,.xls,.csv"
                                    />

                                    <div
                                        onClick={() => !isUploading && fileInputRef.current.click()}
                                        className={`border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/30 p-10 text-center transition-all cursor-pointer group ${isUploading ? 'opacity-50 cursor-wait' : 'hover:bg-indigo-50 hover:border-indigo-400'}`}
                                    >
                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            {isUploading ? <Loader className="w-8 h-8 text-indigo-600 animate-spin" /> : <Upload className="w-8 h-8 text-indigo-600" />}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">{isUploading ? 'Processing Master Data...' : 'Drop Student Master Excel'}</h4>
                                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                            Supported formats: .xlsx, .xls. Ensure columns: Roll_No, Name, Branch, Dept, Sem.
                                        </p>
                                        <button disabled={isUploading} className="mt-6 px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                            {isUploading ? 'Uploading...' : 'Select File'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Logs */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900">System Activity Log</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">HOD Computer Science approved Final Batch</p>
                                                    <p className="text-xs text-gray-500">2 hours ago • PMCS Department</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Departments List */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900">Departments</h3>
                                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {['Computer Science', 'Physics', 'Mathematics', 'Electronics', 'Chemistry'].map((dept, i) => (
                                        <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{dept}</p>
                                                <p className="text-xs text-gray-500">HOD: Dr. Smith</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <AlertCircle className="w-8 h-8 text-indigo-300 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Pending Approvals</h3>
                                    <p className="text-indigo-200 text-sm mb-4">3 Departments have submitted final marks for verification.</p>
                                    <button className="w-full py-2 bg-white text-indigo-900 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                                        Review Now
                                    </button>
                                </div>
                                {/* Decorative circle */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrincipalDashboardPage;
