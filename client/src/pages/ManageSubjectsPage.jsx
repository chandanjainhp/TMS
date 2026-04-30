import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Search, Book } from "lucide-react";
import { toast } from "react-hot-toast";

import AdminLayout from '../components/admin/AdminLayout';
import { useAuthStore } from "../store/authStore";
import { useAdminAuthStore } from "../store/adminAuthStore";

const ManageSubjectsPage = () => {
    const { user } = useAuthStore();
    const { admin } = useAdminAuthStore();
    const currentUser = admin || user;
    const isHOD = currentUser?.department && currentUser?.department !== 'Global';

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterBranch, setFilterBranch] = useState(isHOD ? currentUser.department : "");
    const [filterSemester, setFilterSemester] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [newSubject, setNewSubject] = useState({
        name: "",
        branch: isHOD ? currentUser.department : "",
        semester: "",
        code: ""
    });

    const [isAdding, setIsAdding] = useState(false);

    // Expanded list of branches
    const [branches, setBranches] = useState([]);
    const [newBranchName, setNewBranchName] = useState("");
    const [isAddingBranch, setIsAddingBranch] = useState(false);
    const [showAddBranch, setShowAddBranch] = useState(false);

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    useEffect(() => {
        if (isHOD) {
            setFilterBranch(currentUser.department);
            setNewSubject(prev => ({ ...prev, branch: currentUser.department }));
        }
        fetchBranches();
        fetchSubjects();
    }, [isHOD, currentUser?.department]);

    // Also refetch subjects if filter changes
    useEffect(() => {
        // Optimization: prevent double fetch on mount since fetchSubjects is called above.
        // But we need to react to filter changes.
        // Simple way: check if loading or just refetch.
        if (!loading) fetchSubjects();
    }, [filterBranch, filterSemester]);

    const fetchBranches = async () => {
        try {
            const res = await axios.get("/api/branches", { withCredentials: true });
            if (res.data.success) {
                if (res.data.data.length === 0) {
                    // Try to seed but handled mainly by backend/setup
                }
                setBranches(res.data.data.map(b => b.name));
            }
        } catch (error) {
            console.error("Error fetching branches:", error);
            // Fallback to defaults if API fails or is not ready
            setBranches(['BCA', 'PMCS', 'PME', 'PCM', 'B.Com', 'B.Sc', 'B.A', 'B.B.A', 'MCA', 'M.Sc', 'M.Com']);
        }
    };

    const handleAddBranch = async (e) => {
        e.preventDefault();
        if (!newBranchName.trim()) {
            toast.error("Branch name is required");
            return;
        }

        try {
            setIsAddingBranch(true);
            const res = await axios.post("/api/branches", { name: newBranchName }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Branch added successfully");
                setNewBranchName("");
                setShowAddBranch(false);
                fetchBranches();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add branch");
        } finally {
            setIsAddingBranch(false);
        }
    };

    const fetchSubjects = async () => {
        // ... (existing fetch logic remains same, but verifying access to state)
        setLoading(true);
        try {
            let query = "?";
            if (filterBranch) query += `branch=${filterBranch}&`;
            if (filterSemester) query += `semester=${filterSemester}`;

            const res = await axios.get(`/api/subjects${query}`, { withCredentials: true });
            if (res.data.success) {
                setSubjects(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch subjects");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject.name || !newSubject.branch || !newSubject.semester) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setIsAdding(true);
            const res = await axios.post("/api/subjects", newSubject, { withCredentials: true });
            if (res.data.success) {
                toast.success("Subject added successfully");
                setNewSubject({ name: "", branch: isHOD ? currentUser.department : "", semester: "", code: "" });
                fetchSubjects();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add subject");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSubject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;
        try {
            const res = await axios.delete(`/api/subjects/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success("Subject deleted");
                setSubjects(subjects.filter(s => s._id !== id));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subject");
        }
    };

    const filteredSubjects = subjects.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="min-h-screen bg-[#f6f5f4] w-full transition-all duration-300">
                <div className="p-6">
                    <div className="max-w-6xl mx-auto space-y-6">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[rgba(0,0,0,0.95)]">Curriculum Manager</h1>
                                <p className="text-[#615d59]">Configure subjects and course structures for departments.</p>
                            </div>
                            {!isHOD && (
                                <button
                                    onClick={() => setShowAddBranch(!showAddBranch)}
                                    className="bg-white border border-[rgba(0,0,0,0.1)] text-[#37352f] px-4 py-2 rounded text-sm font-medium hover:bg-[#f6f5f4] flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Branch
                                </button>
                            )}
                        </div>

                        {/* Add Branch Section (Conditional) */}
                        {showAddBranch && !isHOD && (
                            <div className="bg-white p-4 rounded border border-[rgba(0,0,0,0.1)] bg-[#f2f9ff] animate-in slide-in-from-top-2">
                                <h3 className="text-sm font-bold text-gray-800 mb-3">Add New Branch</h3>
                                <form onSubmit={handleAddBranch} className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Branch Name (e.g. MBA)"
                                        value={newBranchName}
                                        onChange={e => setNewBranchName(e.target.value)}
                                        className="flex-1 rounded border-[rgba(0,0,0,0.1)] border px-3 py-2 text-sm focus:ring-2 focus:ring-[#097fe8] outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isAddingBranch}
                                        className="bg-[#0075de] text-white px-4 py-2 rounded hover:bg-[#005bab] transition text-sm font-medium flex items-center gap-2"
                                    >
                                        {isAddingBranch ? 'Saving...' : 'Save Branch'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddBranch(false);
                                            setNewBranchName("");
                                        }}
                                        className="bg-white border border-[rgba(0,0,0,0.1)] text-gray-700 px-4 py-2 rounded hover:bg-[#f6f5f4] transition text-sm font-medium"
                                    >
                                        Discard
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Add New Subject Form */}
                        <div className="bg-white p-6 rounded border border-[rgba(0,0,0,0.1)]">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#0075de]" /> Add New Subject
                            </h2>
                            <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                    <select
                                        value={newSubject.branch}
                                        disabled={isHOD}
                                        onChange={e => setNewSubject({ ...newSubject, branch: e.target.value })}
                                        className={`w-full rounded border-[rgba(0,0,0,0.1)] border px-3 py-2 text-sm focus:ring-2 focus:ring-[#097fe8] outline-none ${isHOD ? 'bg-gray-100 text-gray-500' : ''}`}
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                    <select
                                        value={newSubject.semester}
                                        onChange={e => setNewSubject({ ...newSubject, semester: e.target.value })}
                                        className="w-full rounded border-[rgba(0,0,0,0.1)] border px-3 py-2 text-sm focus:ring-2 focus:ring-[#097fe8] outline-none"
                                    >
                                        <option value="">Select</option>
                                        {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Advanced Operating Systems"
                                        value={newSubject.name}
                                        onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                        className="w-full rounded border-[rgba(0,0,0,0.1)] border px-3 py-2 text-sm focus:ring-2 focus:ring-[#097fe8] outline-none"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <button
                                        type="submit"
                                        disabled={isAdding}
                                        className="w-full bg-[#0075de] text-white py-2 rounded hover:bg-[#005bab] transition font-medium flex justify-center items-center gap-2"
                                    >
                                        {isAdding ? 'Adding...' : 'Add Subject'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Filter and List */}
                        <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] overflow-hidden">
                            <div className="p-4 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="flex gap-4 w-full md:w-auto">
                                    <select
                                        value={filterBranch}
                                        disabled={isHOD}
                                        onChange={e => setFilterBranch(e.target.value)}
                                        className={`rounded border-[rgba(0,0,0,0.1)] border px-3 py-2 text-sm focus:ring-2 focus:ring-[#097fe8] outline-none ${isHOD ? 'bg-gray-100 text-gray-500' : ''}`}
                                    >
                                        <option value="">All Branches</option>
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <select
                                        value={filterSemester}
                                        onChange={e => setFilterSemester(e.target.value)}
                                        className="rounded border-[rgba(0,0,0,0.1)] border px-3 py-2 text-sm focus:ring-2 focus:ring-[#097fe8] outline-none"
                                    >
                                        <option value="">All Semesters</option>
                                        {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
                                    </select>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search subjects..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 rounded border border-[rgba(0,0,0,0.1)] text-sm focus:ring-2 focus:ring-[#097fe8] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-[#f6f5f4] text-gray-900 font-semibold border-b border-[rgba(0,0,0,0.1)]">
                                        <tr>
                                            <th className="px-6 py-3">Subject Name</th>
                                            <th className="px-6 py-3">Branch</th>
                                            <th className="px-6 py-3">Semester</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
                                        {loading ? (
                                            <tr><td colSpan="4" className="p-8 text-center">Loading...</td></tr>
                                        ) : filteredSubjects.length === 0 ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">No subjects found.</td></tr>
                                        ) : (
                                            filteredSubjects.map(sub => (
                                                <tr key={sub._id} className="hover:bg-[#f6f5f4] transition">
                                                    <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2">
                                                        <Book className="w-4 h-4 text-[#0075de]" />
                                                        {sub.name}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="bg-[#f2f9ff] text-[#005bab] px-2 py-1 rounded text-xs font-bold">{sub.branch}</span>
                                                    </td>
                                                    <td className="px-6 py-3">Sem {sub.semester}</td>
                                                    <td className="px-6 py-3 text-right">
                                                        <button
                                                            onClick={() => handleDeleteSubject(sub._id)}
                                                            className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
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
            </div>
        </AdminLayout>
    );
};

export default ManageSubjectsPage;
