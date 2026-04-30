import AdminLayout from "../components/admin/AdminLayout";
import { useAuthStore } from "../store/authStore";
import { useAdminAuthStore } from "../store/adminAuthStore";
import { FileText, Users, Plus, Search, Trash2, Settings, Calendar, BarChart2, MessageSquare, ChevronRight, BookOpen, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const QUICK_ACTIONS = [
  { icon: FileText, label: "Academic Ledger", sub: "Student marks & records", href: "/admin/records" },
  { icon: ShieldCheck, label: "Teacher Log", sub: "Activity & audit trail", href: "/admin/teacher-log" },
  { icon: BarChart2, label: "Analytics", sub: "Department insights", href: "/admin/analytics" },
  { icon: MessageSquare, label: "Messages", sub: "Inbox & announcements", href: "/admin/messages" },
  { icon: BookOpen, label: "Curriculum", sub: "Subjects & schedule", href: "/admin/subjects" },
  { icon: Settings, label: "Settings", sub: "Account & system", href: "/admin/settings" },
];

const AdminDashboardPage = () => {
  const { user } = useAuthStore();
  const { admin } = useAdminAuthStore();
  const currentUser = admin || user;

  const [instructors, setInstructors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setFetching(true);
    try {
      const res = await axios.get("/api/teacher/list");
      if (res.data.success) setInstructors(res.data.teachers);
    } catch {
      toast.error("Failed to fetch instructors");
    } finally {
      setFetching(false);
    }
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/teacher/create", newInstructor);
      if (res.data.success) {
        toast.success("Instructor added");
        setNewInstructor({ name: "", email: "", password: "" });
        setShowAddModal(false);
        fetchInstructors();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add instructor");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = instructors.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  );

  const dept = currentUser?.department || "General";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="notion-badge mb-3">System online</span>
              <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">{dept}</h1>
              <p className="mt-2 text-sm text-[#615d59]">HOD: {currentUser?.name || "—"} · Academic Control Center</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-5 py-3 text-center">
                <div className="text-3xl font-bold text-[rgba(0,0,0,0.95)]">{fetching ? "--" : String(instructors.length).padStart(2, "0")}</div>
                <div className="text-[10px] uppercase tracking-[0.125px] text-[#615d59]">Faculty</div>
              </div>

              <button onClick={() => setShowAddModal(true)} className="notion-btn-primary">
                <Plus className="mr-1 h-4 w-4" />
                Add Instructor
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
              <div className="flex items-center justify-between gap-3 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-[#097fe8]" />
                  <span className="text-sm font-bold text-[rgba(0,0,0,0.95)]">Faculty Roster</span>
                  <span className="rounded border border-[rgba(0,0,0,0.1)] bg-white px-2 py-0.5 text-[10px] text-[#615d59]">{instructors.length} enrolled</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a39e98]" />
                  <input
                    type="text"
                    placeholder="search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-44 rounded border border-[rgba(0,0,0,0.1)] bg-white py-1.5 pl-8 pr-3 text-xs text-[rgba(0,0,0,0.95)] outline-none focus:border-[#097fe8]"
                  />
                </div>
              </div>

              <div className="grid gap-4 border-b border-[rgba(0,0,0,0.1)] px-5 py-2 text-[10px] uppercase tracking-[0.125px] text-[#615d59]" style={{ gridTemplateColumns: "32px 1fr auto 32px" }}>
                <span>#</span>
                <span>Name / Contact</span>
                <span>State</span>
                <span />
              </div>

              <div>
                <AnimatePresence mode="popLayout">
                  {fetching ? (
                    <div className="py-14 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#097fe8]" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-14 text-center">
                      <p className="text-sm text-[#615d59]">{search ? "No match found." : "No faculty enrolled yet."}</p>
                      {!search && (
                        <button onClick={() => setShowAddModal(true)} className="text-sm font-semibold text-[#0075de] hover:underline">
                          Add first instructor
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    filtered.map((teacher, i) => (
                      <motion.div
                        key={teacher._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        className="group grid items-center gap-4 border-b border-[rgba(0,0,0,0.06)] px-5 py-3 transition-colors hover:bg-[#f6f5f4]"
                        style={{ gridTemplateColumns: "32px 1fr auto 32px" }}
                      >
                        <span className="text-[10px] text-[#615d59]">{String(i + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)]">{teacher.name}</p>
                          <p className="truncate text-xs text-[#615d59]">{teacher.email}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#1aae39]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1aae39]" />
                          Active
                        </span>
                        <button className="flex h-7 w-7 items-center justify-center rounded text-[#a39e98] opacity-0 transition-all hover:bg-[#fff5f2] hover:text-[#dd5b00] group-hover:opacity-100">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {instructors.length > 0 && (
                <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.1)] px-5 py-3 text-xs text-[#615d59]">
                  <span>{filtered.length} / {instructors.length} shown</span>
                  <Link to="/admin/records" className="font-semibold text-[#0075de] no-underline hover:underline">
                    View records →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <p className="mb-3 px-1 text-[10px] uppercase tracking-[0.125px] text-[#615d59]">Quick Access</p>
            {QUICK_ACTIONS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.1)] bg-white px-4 py-3 no-underline transition-all hover:bg-[#f6f5f4]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f2f9ff] text-[#097fe8]">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)]">{item.label}</p>
                  <p className="truncate text-[11px] text-[#615d59]">{item.sub}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-[#a39e98]" />
              </Link>
            ))}

            <div className="mt-3 rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-4">
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded bg-[#f2f9ff] text-[#097fe8]">
                <Calendar className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">Calendar</p>
              <p className="text-xs text-[#615d59]">Coming soon</p>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 24 }}
              className="w-full max-w-md overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.05)_0px_23px_52px]"
            >
              <div className="flex items-start justify-between border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-6 py-4">
                <div>
                  <h3 className="text-lg font-bold text-[rgba(0,0,0,0.95)]">Add Instructor</h3>
                  <p className="mt-1 text-xs text-[#615d59]">New faculty · {dept}</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-2xl leading-none text-[#615d59]">×</button>
              </div>

              <form onSubmit={handleAddInstructor} className="space-y-4 p-6">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Dr. Full Name" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "email@institution.edu" },
                  { label: "Default Password", key: "password", type: "password", placeholder: "••••••••" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={newInstructor[field.key]}
                      onChange={(e) => setNewInstructor({ ...newInstructor, [field.key]: e.target.value })}
                      className="w-full rounded border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-sm text-[rgba(0,0,0,0.95)] outline-none focus:border-[#097fe8]"
                    />
                  </div>
                ))}

                <div className="mt-6 flex justify-end gap-3 border-t border-[rgba(0,0,0,0.1)] pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="notion-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="notion-btn-primary min-w-[130px]">
                    {isLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
