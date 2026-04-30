import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Users2, Mail, Building2, Plus, Trash2, ChevronDown } from 'lucide-react';
import PrincipalLayout from '../components/layout/PrincipalLayout';
import toast from 'react-hot-toast';

export default function FacultyDirectoryPage() {
    const [faculty, setFaculty] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', department: '' });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchFaculty();
        axios.get('/api/branches', { withCredentials: true })
            .then(res => { if (res.data.success) setBranches((res.data.data ?? []).map(b => b.name ?? b)); })
            .catch(() => {});
    }, []);

    const fetchFaculty = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/teacher/list', { withCredentials: true });
            if (res.data.success) setFaculty(res.data.teachers);
        } catch {
            toast.error('Failed to load faculty');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Remove ${name} from the system?`)) return;
        try {
            await axios.delete(`/api/principal/admins/${id}`, { withCredentials: true });
            toast.success('Account removed');
            fetchFaculty();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            await axios.post('/api/teacher/create', newTeacher, { withCredentials: true });
            toast.success('Instructor added');
            setShowAddModal(false);
            setNewTeacher({ name: '', email: '', password: '', department: '' });
            fetchFaculty();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add');
        } finally {
            setAdding(false);
        }
    };

    const filtered = faculty.filter(f => {
        const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.email.toLowerCase().includes(search.toLowerCase());
        const matchDept = !deptFilter || f.department === deptFilter;
        return matchSearch && matchDept;
    });

    const grouped = branches.reduce((acc, dept) => {
        const members = filtered.filter(f => f.department === dept);
        if (members.length > 0) acc[dept] = members;
        return acc;
    }, {});

    const ungrouped = filtered.filter(f => !branches.includes(f.department));

    return (
        <PrincipalLayout title="Faculty Directory">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users2 className="w-6 h-6 text-[#0075de]" />
                            Faculty Directory
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">{faculty.length} instructors across all departments</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0075de] text-white text-sm font-bold rounded hover:bg-[#005bab] transition-colors shadow-[rgba(0,0,0,0.04)_0px_4px_18px]"
                    >
                        <Plus className="w-4 h-4" /> Add Instructor
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8] bg-white"
                        />
                    </div>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={deptFilter}
                            onChange={e => setDeptFilter(e.target.value)}
                            className="pl-9 pr-8 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8] bg-white appearance-none"
                        >
                            <option value="">All Departments</option>
                            {branches.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#0075de] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Users2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No faculty found</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([dept, members]) => (
                            <div key={dept} className="bg-white rounded border border-[rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] flex items-center justify-between">
                                    <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-[#0075de]" />
                                        {dept}
                                    </h2>
                                    <span className="text-xs font-bold text-[#0075de] bg-[#f2f9ff] px-2 py-0.5 rounded-full">
                                        {members.length} members
                                    </span>
                                </div>
                                <div className="divide-y divide-[rgba(0,0,0,0.08)]">
                                    {members.map(teacher => (
                                        <div key={teacher._id} className="px-6 py-4 flex items-center justify-between hover:bg-[#f6f5f4] transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-[#f2f9ff] flex items-center justify-center text-[#005bab] font-bold text-sm flex-shrink-0">
                                                    {teacher.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{teacher.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {teacher.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                                    Active
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(teacher._id, teacher.name)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {ungrouped.length > 0 && (
                            <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] overflow-hidden">
                                <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]">
                                    <h2 className="font-bold text-gray-500 text-sm">Unassigned Department</h2>
                                </div>
                                <div className="divide-y divide-[rgba(0,0,0,0.08)]">
                                    {ungrouped.map(teacher => (
                                        <div key={teacher._id} className="px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                                                    {teacher.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{teacher.name}</p>
                                                    <p className="text-xs text-gray-500">{teacher.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete(teacher._id, teacher.name)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] shadow-[rgba(0,0,0,0.04)_0px_4px_18px] w-full max-w-md">
                        <div className="p-6 border-b border-[rgba(0,0,0,0.1)] flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900">Add Instructor</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            {[
                                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Dr. Jane Doe' },
                                { label: 'Email', key: 'email', type: 'email', placeholder: 'jane@institution.edu' },
                                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                                    <input
                                        type={f.type}
                                        required
                                        placeholder={f.placeholder}
                                        value={newTeacher[f.key]}
                                        onChange={e => setNewTeacher({ ...newTeacher, [f.key]: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8]"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                <select
                                    required
                                    value={newTeacher.department}
                                    onChange={e => setNewTeacher({ ...newTeacher, department: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8]"
                                >
                                    <option value="">Select Department</option>
                                    {branches.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 text-sm">Cancel</button>
                                <button type="submit" disabled={adding} className="flex-1 py-2.5 bg-[#0075de] text-white font-bold rounded hover:bg-[#005bab] text-sm disabled:opacity-50">
                                    {adding ? 'Adding...' : 'Add Instructor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PrincipalLayout>
    );
}
