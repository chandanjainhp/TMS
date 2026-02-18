import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Search, Filter, Lock, Download, FileSpreadsheet, ChevronDown, CheckCircle } from 'lucide-react';

const StudentRepositoryPage = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        department: user?.department === 'Global' ? '' : user?.department || '',
        branch: '',
        semester: '',
        section: '',
        year: ''
    });

    // Dynamic Columns (Test Types)
    const [testColumns, setTestColumns] = useState([]);

    // Dropdown Data
    const departments = ['Physics', 'Mathematics', 'Electronics', 'Computer Science', 'Chemistry', 'Biology'];
    const branches = ['PMCS', 'BCA', 'PME', 'PCM'];

    useEffect(() => {
        if (filters.department && filters.branch && filters.semester) {
            fetchRepository();
        }
    }, [filters.department, filters.branch, filters.semester, filters.section, filters.year]);

    const fetchRepository = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/students/repository', {
                params: filters,
                withCredentials: true
            });

            if (res.data.success) {
                const fetchedStudents = res.data.data;
                setStudents(fetchedStudents);

                // Extract all unique test keys from marks map
                const allTestTypes = new Set();
                fetchedStudents.forEach(s => {
                    if (s.marks) {
                        Object.keys(s.marks).forEach(k => allTestTypes.add(k));
                    }
                });
                setTestColumns(Array.from(allTestTypes).sort());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        if (!confirm("Are you sure you want to finalize this semester? Records will be locked.")) return;

        try {
            await axios.post('http://localhost:5000/api/students/finalize', filters, { withCredentials: true });
            fetchRepository(); // Refresh to see locked status
        } catch (error) {
            alert("Failed to finalize: " + error.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Academic Ledger</h1>
                        <p className="text-gray-500">View and manage incremental assessment records.</p>
                    </div>
                    {students.length > 0 && (
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                            <button
                                onClick={handleFinalize}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                            >
                                <Lock className="w-4 h-4" /> Finalize Semester
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                        >
                            <option value="">Select Dept</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Branch</label>
                        <select
                            value={filters.branch}
                            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Semester</label>
                        <select
                            value={filters.semester}
                            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-lg"
                        >
                            <option value="">Select Sem</option>
                            {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <button
                            onClick={fetchRepository}
                            className="w-full md:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        >
                            Load Data
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-4 font-semibold text-gray-600 text-sm">USN</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                                    {testColumns.map(col => (
                                        <th key={col} className="p-4 font-semibold text-gray-600 text-sm">{col}</th>
                                    ))}
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={3 + testColumns.length} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : students.length === 0 ? (
                                    <tr><td colSpan={3 + testColumns.length} className="p-8 text-center text-gray-500">No records found. Select filters to view data.</td></tr>
                                ) : (
                                    students.map(student => (
                                        <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 text-sm font-medium text-gray-900">{student.usn}</td>
                                            <td className="p-4 text-sm text-gray-600">{student.name}</td>
                                            {testColumns.map(col => (
                                                <td key={col} className="p-4 text-sm text-gray-600">
                                                    {student.marks ? student.marks[col] : '-'}
                                                </td>
                                            ))}
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${student.lockStatus === 'Final' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {student.lockStatus === 'Final' ? <Lock className="w-3 h-3" /> : <FileSpreadsheet className="w-3 h-3" />}
                                                    {student.lockStatus || 'Draft'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRepositoryPage;
