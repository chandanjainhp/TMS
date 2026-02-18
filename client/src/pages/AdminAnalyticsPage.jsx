import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import AdminLayout from '../components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Download, Filter, Loader, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminAnalyticsPage = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [distribution, setDistribution] = useState([]);
    const [subjectPerformance, setSubjectPerformance] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        department: '',
        year: '',
        section: '',
        subject: '',
        testType: ''
    });

    // Suggestions state
    const [suggestions, setSuggestions] = useState({
        departments: [],
        sections: [],
        subjects: [],
        testTypes: []
    });

    const reportRef = useRef(null);

    // Fetch dynamic filter options
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/analytics/filters', { withCredentials: true });
                if (response.data.success) {
                    setSuggestions(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };
        fetchFilters();
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await axios.get(`http://localhost:5000/api/analytics/class-performance?${queryParams}`, { withCredentials: true });

            if (response.data.success) {
                setStats(response.data.data.stats);

                // Process distribution data for charts
                const distData = response.data.data.distribution.map(item => ({
                    name: getRangeLabel(item._id), // Helper to label buckets
                    value: item.count
                }));
                setDistribution(distData);

                setSubjectPerformance(response.data.data.subjectPerformance);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Helper to label buckets (matches controller logic)
    const getRangeLabel = (id) => {
        const ranges = {
            0: '0-35 (Fail)',
            35: '35-50 (Pass)',
            50: '50-60 (Second Class)',
            60: '60-75 (First Class)',
            75: '75-90 (Distinction)',
            90: '90-100 (Outstanding)'
        };
        return ranges[id] || 'Other';
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`analytics_report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
                        <p className="text-gray-500">Class performance insights and report generation</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchAnalytics}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Download size={18} />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 items-end gap-2">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Department</label>
                        <input
                            list="departments"
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            placeholder="All Departments"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <datalist id="departments">
                            {suggestions.departments?.map((dept, idx) => dept && <option key={idx} value={dept} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Year</label>
                        <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="">All Years</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Section</label>
                        <input
                            list="sections"
                            type="text"
                            name="section"
                            value={filters.section}
                            onChange={handleFilterChange}
                            placeholder="e.g. A"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <datalist id="sections">
                            {suggestions.sections?.map((sec, idx) => sec && <option key={idx} value={sec} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Subject</label>
                        <input
                            list="subjects"
                            type="text"
                            name="subject"
                            value={filters.subject}
                            onChange={handleFilterChange}
                            placeholder="Subject Code/Name"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <datalist id="subjects">
                            {suggestions.subjects?.map((sub, idx) => sub && <option key={idx} value={sub} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Test Type</label>
                        <select name="testType" value={filters.testType} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="">All Tests</option>
                            {suggestions.testTypes?.map((type, idx) => type && <option key={idx} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium h-[38px] flex items-center justify-center gap-2"
                    >
                        <Filter size={16} /> Apply
                    </button>
                </div>

                {/* Report Content Area (Target for PDF) */}
                <div ref={reportRef} className="space-y-6 bg-slate-50 p-2 md:p-0">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Total Records</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalRecords || 0}</h3>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Class Average</p>
                            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{stats?.avgTotalMarks?.toFixed(1) || 0}</h3>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Highest Score</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats?.maxTotalMarks || 0}</h3>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Lowest Score</p>
                            <h3 className="text-2xl font-bold text-red-500 mt-1">{stats?.minTotalMarks || 0}</h3>
                        </motion.div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Performance Distribution */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Performance Distribution</h3>
                            <div className="h-80">
                                {distribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={distribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No data available</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Subject Averages (Only if multiple subjects) */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Subject Performance</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={subjectPerformance}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Bar dataKey="avgMarks" name="Average Marks" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalyticsPage;
