import { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Shield, Plus, Trash2, Building2, User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import PrincipalLayout from '../components/layout/PrincipalLayout';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Physics', 'Mathematics', 'Electronics', 'Computer Science', 'Chemistry', 'Biology'];

const ROLE_LABELS = {
    principal: { label: 'Principal', color: 'bg-[#f2f9ff] text-[#005bab]' },
    hod: { label: 'HOD', color: 'bg-[#f2f9ff] text-[#005bab]' },
    admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700' },
    superAdmin: { label: 'Super Admin', color: 'bg-amber-100 text-amber-700' },
};

export default function PrincipalSystemSettingsPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddHOD, setShowAddHOD] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newHOD, setNewHOD] = useState({ name: '', email: '', password: '', department: '' });
    const [adding, setAdding] = useState(false);

    useEffect(() => { fetchAdmins(); }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/principal/admins', { withCredentials: true });
            if (res.data.success) setAdmins(res.data.admins);
        } catch {
            toast.error('Failed to load admin accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleAddHOD = async (e) => {
        e.preventDefault();
        if (newHOD.password.length < 8) return toast.error('Password must be at least 8 characters');
        setAdding(true);
        try {
            await axios.post('/api/principal/create-hod', newHOD, { withCredentials: true });
            toast.success('HOD account created');
            setShowAddHOD(false);
            setNewHOD({ name: '', email: '', password: '', department: '' });
            fetchAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create HOD');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete account for ${name}? This cannot be undone.`)) return;
        try {
            await axios.delete(`/api/principal/admins/${id}`, { withCredentials: true });
            toast.success('Account deleted');
            fetchAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const principals = admins.filter(a => a.role === 'principal' || a.role === 'superAdmin');
    const hods = admins.filter(a => a.role === 'hod' || a.role === 'admin');

    return (
        <PrincipalLayout title="System Settings">
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[rgba(0,0,0,0.95)] flex items-center gap-2">
                        <Settings className="w-6 h-6 text-slate-600" />
                        System Settings
                    </h1>
                    <p className="text-sm text-[#615d59] mt-0.5">Manage admin accounts and system configuration</p>
                </div>

                {/* System Info */}
                <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] p-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        System Status
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Application', value: 'TMS v1.0', status: 'healthy' },
                            { label: 'Database', value: 'MongoDB Connected', status: 'healthy' },
                            { label: 'Environment', value: 'Development', status: 'info' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-3 p-3 bg-[#f6f5f4] rounded">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'healthy' ? 'bg-green-500' : 'bg-blue-400'}`} />
                                <div>
                                    <p className="text-xs text-[#615d59]">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Principal Accounts */}
                <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)] flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#0075de]" />
                        <h2 className="font-bold text-gray-900">Principal / Super Admin</h2>
                    </div>
                    {loading ? (
                        <div className="py-10 flex justify-center">
                            <div className="w-6 h-6 border-2 border-[#0075de] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : principals.length === 0 ? (
                        <div className="px-6 py-8 text-sm text-gray-400 text-center">No principal accounts found</div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {principals.map(admin => (
                                <AdminRow key={admin._id} admin={admin} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>

                {/* HOD Accounts */}
                <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#0075de]" />
                            <h2 className="font-bold text-gray-900">Heads of Department</h2>
                            <span className="text-xs font-bold text-[#0075de] bg-[#f2f9ff] px-2 py-0.5 rounded-full">{hods.length}</span>
                        </div>
                        <button
                            onClick={() => setShowAddHOD(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0075de] text-white text-xs font-bold rounded hover:bg-[#005bab] transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add HOD
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-10 flex justify-center">
                            <div className="w-6 h-6 border-2 border-[#0075de] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : hods.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm text-gray-400 mb-3">No HOD accounts yet</p>
                            <button
                                onClick={() => setShowAddHOD(true)}
                                className="px-4 py-2 bg-[#f2f9ff] text-[#0075de] text-sm font-bold rounded hover:bg-[#d2e9ff]"
                            >
                                Create First HOD
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {hods.map(admin => (
                                <AdminRow key={admin._id} admin={admin} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Department Overview */}
                <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Department Coverage</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {DEPARTMENTS.map(dept => {
                            const hasHOD = hods.some(h => h.department === dept);
                            return (
                                 <div key={dept} className={`p-3 rounded border text-sm flex items-center gap-2 ${hasHOD ? 'border-green-200 bg-green-50' : 'border-[rgba(0,0,0,0.1)] bg-[#f6f5f4]'}`}>
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasHOD ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={`font-medium ${hasHOD ? 'text-green-800' : 'text-gray-500'}`}>{dept}</span>
                                </div>
                            );
                        })}
                    </div>
                     <p className="text-xs text-[#615d59] mt-3">
                        {hods.filter(h => DEPARTMENTS.includes(h.department)).length} of {DEPARTMENTS.length} departments have assigned HODs
                    </p>
                </div>
            </div>

            {/* Add HOD Modal */}
            {showAddHOD && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] shadow-[rgba(0,0,0,0.04)_0px_4px_18px] w-full max-w-md">
                        <div className="p-6 border-b border-[rgba(0,0,0,0.1)] flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">Create HOD Account</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Head of Department — department-level admin access</p>
                            </div>
                            <button onClick={() => setShowAddHOD(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                        </div>
                        <form onSubmit={handleAddHOD} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        required
                                        value={newHOD.department}
                                        onChange={e => setNewHOD({ ...newHOD, department: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8]"
                                    >
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            {[
                                { label: 'Full Name', key: 'name', icon: User, type: 'text', placeholder: 'Dr. Full Name' },
                                { label: 'Email', key: 'email', icon: Mail, type: 'email', placeholder: 'hod@institution.edu' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                                    <div className="relative">
                                        <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={f.type}
                                            required
                                            placeholder={f.placeholder}
                                            value={newHOD[f.key]}
                                            onChange={e => setNewHOD({ ...newHOD, [f.key]: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8]"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Min 8 characters"
                                        value={newHOD.password}
                                        onChange={e => setNewHOD({ ...newHOD, password: e.target.value })}
                                        className="w-full pl-9 pr-10 py-2.5 border border-[rgba(0,0,0,0.1)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#097fe8]"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowAddHOD(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 text-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={adding} className="flex-1 py-2.5 bg-[#0075de] text-white font-bold rounded hover:bg-[#005bab] text-sm disabled:opacity-50">
                                    {adding ? 'Creating...' : 'Create HOD'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PrincipalLayout>
    );
}

function AdminRow({ admin, onDelete }) {
    const roleInfo = ROLE_LABELS[admin.role] || { label: admin.role, color: 'bg-gray-100 text-gray-600' };
    return (
        <div className="px-6 py-4 flex items-center justify-between hover:bg-[#f6f5f4] transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#f2f9ff] flex items-center justify-center text-[#005bab] font-bold text-sm flex-shrink-0">
                    {admin.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{admin.name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
                            {roleInfo.label}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                    {admin.department && admin.department !== 'Global' && (
                        <p className="text-xs text-[#0075de] font-medium mt-0.5">{admin.department}</p>
                    )}
                </div>
            </div>
            <button
                onClick={() => onDelete(admin._id, admin.name)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
