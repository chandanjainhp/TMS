import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, GraduationCap, Download, ChevronDown, Filter } from 'lucide-react';
import PrincipalLayout from '../components/layout/PrincipalLayout';
import toast from 'react-hot-toast';

const SEMESTERS = ['1', '2', '3', '4', '5', '6'];

export default function StudentMasterPage() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ department: '', branch: '', year: '' });
    const [stats, setStats] = useState({ total: 0, departments: 0 });

    useEffect(() => {
        fetchDepartments();
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [filters]);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get('/api/branches', { withCredentials: true });
            if (res.data.success) {
                setDepartments(res.data.data.map(b => b.name));
            }
        } catch {
            toast.error('Failed to load departments');
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await axios.get('/api/branches', { withCredentials: true });
            if (res.data.success) {
                setBranches(res.data.data.map(b => b.name));
            }
        } catch {
            toast.error('Failed to load branches');
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.department) params.department = filters.department;
            if (filters.branch) params.branch = filters.branch;
            if (filters.year) params.year = filters.year;
            if (search) params.searchTerm = search;

            const res = await axios.get('/api/students/students', { params, withCredentials: true });
            const data = Array.isArray(res.data) ? res.data : [];
            setStudents(data);
            const depts = new Set(data.map(s => s.department)).size;
            setStats({ total: data.length, departments: depts });
        } catch {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleExportCSV = () => {
        window.open('/api/students/export/csv', '_blank');
    };

    const filtered = students.filter(s =>
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.usn?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PrincipalLayout title="Student Master">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[rgba(0,0,0,0.95)] flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-[#0075de]" />
                            Student Master
                        </h1>
                        <p className="text-sm text-[#615d59] mt-0.5">Complete student roster across all departments</p>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.1)] text-[#37352f] text-sm font-bold rounded hover:bg-[#f6f5f4] transition-colors"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Total Students', value: stats.total, color: 'text-[#0075de]', bg: 'bg-[#f2f9ff]' },
                        { label: 'Departments', value: stats.departments, color: 'text-[#0075de]', bg: 'bg-[#f2f9ff]' },
                        { label: 'Showing', value: filtered.length, color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded p-4 border border-[rgba(0,0,0,0.08)]`}>
                            <p className="text-xs font-semibold text-[#615d59] uppercase tracking-wide">{s.label}</p>
                            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name or USN..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8]"
                        />
                    </form>

                    {[
                        { label: 'Department', key: 'department', options: departments },
                        { label: 'Branch', key: 'branch', options: branches },
                    ].map(f => (
                        <div key={f.key} className="relative min-w-[140px]">
                            <select
                                value={filters[f.key]}
                                onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                                className="w-full pl-3 pr-8 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8] appearance-none bg-white"
                            >
                                <option value="">{f.label}</option>
                                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    ))}

                    <button
                        onClick={fetchStudents}
                        className="px-5 py-2.5 bg-[#37352f] text-white text-sm font-bold rounded hover:bg-[#2f2c28]"
                    >
                        <Filter className="w-4 h-4 inline mr-1.5" />
                        Filter
                    </button>

                    {(filters.department || filters.branch || search) && (
                        <button
                            onClick={() => { setFilters({ department: '', branch: '', year: '' }); setSearch(''); }}
                            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#f6f5f4] border-b border-[rgba(0,0,0,0.1)]">
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">#</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">USN</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">Name</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">Department</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">Branch</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">Sem</th>
                                    <th className="px-4 py-3 text-xs font-bold text-[#615d59] uppercase tracking-wide">Section</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
                                {loading ? (
                                    <tr><td colSpan={7} className="py-16 text-center">
                                        <div className="w-6 h-6 border-2 border-[#0075de] border-t-transparent rounded-full animate-spin mx-auto" />
                                    </td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="py-16 text-center text-gray-400">
                                        <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm">No students found. Upload master data from the dashboard.</p>
                                    </td></tr>
                                ) : filtered.map((student, i) => (
                                    <tr key={student._id} className="hover:bg-[#f6f5f4] transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{i + 1}</td>
                                        <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{student.usn}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{student.department || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{student.branch || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#f2f9ff] text-[#005bab]">
                                                {student.semester || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{student.section || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length > 0 && (
                        <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.1)] text-xs text-[#615d59]">
                            Showing {filtered.length} of {students.length} students
                        </div>
                    )}
                </div>
            </div>
        </PrincipalLayout>
    );
}
