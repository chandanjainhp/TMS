import { useState, useRef, useEffect } from "react";
import { Building2, Users2, GraduationCap, Upload, FileSpreadsheet, TrendingUp, AlertCircle, Loader } from "lucide-react";
import { useAdminAuthStore } from "../store/adminAuthStore";
import PrincipalLayout from "../components/layout/PrincipalLayout";
import axios from "axios";
import toast from "react-hot-toast";

const PrincipalDashboardPage = () => {
  const { admin } = useAdminAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    deptCount: 0,
    facultyCount: 0,
    studentCount: 0,
    avgAttendance: "0%",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/principal/stats");
      if (res.data.success) {
        setDashboardStats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    setUploadStats(null);
    const toastId = toast.loading("Processing master data...");

    try {
      const response = await axios.post("/api/principal/upload-master", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message, { id: toastId });
        setUploadStats(response.data.stats);
        fetchStats();
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
    { label: "Total Departments", value: dashboardStats.deptCount, icon: Building2 },
    { label: "Active Faculty", value: dashboardStats.facultyCount, icon: Users2 },
    { label: "Enrolled Scholars", value: dashboardStats.studentCount, icon: GraduationCap },
    { label: "Avg Attendance", value: dashboardStats.avgAttendance, icon: TrendingUp },
  ];

  return (
    <PrincipalLayout title="Institution Overview">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-6 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
          <h1 className="text-2xl font-bold text-[rgba(0,0,0,0.95)]">Welcome, {admin?.name || "Principal"}</h1>
          <p className="mt-1 text-sm text-[#615d59]">Manage institutional operations from a single workspace.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
              <div className="mb-3 inline-flex rounded-full bg-[#f2f9ff] p-2 text-[#097fe8]">
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-[rgba(0,0,0,0.95)]">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
              <div className="border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[rgba(0,0,0,0.95)]">
                  <FileSpreadsheet className="h-5 w-5 text-[#097fe8]" />
                  Master Student Data Import
                </h3>
                <p className="mt-1 text-sm text-[#615d59]">
                  Upload roster data to populate departments and branches automatically.
                </p>
                {uploadStats && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-[#f2fbf5] px-2 py-1 text-[#1aae39]">Created: {uploadStats.created}</span>
                    <span className="rounded-full bg-[#f2f9ff] px-2 py-1 text-[#097fe8]">Updated: {uploadStats.updated}</span>
                    {uploadStats.failed > 0 && <span className="rounded-full bg-[#fff5f2] px-2 py-1 text-[#dd5b00]">Failed: {uploadStats.failed}</span>}
                  </div>
                )}
              </div>
              <div className="p-8">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".xlsx,.xls,.csv" />
                <div
                  onClick={() => !isUploading && fileInputRef.current.click()}
                  className={`cursor-pointer rounded-xl border border-dashed border-[rgba(0,0,0,0.2)] bg-[#f6f5f4] p-10 text-center transition-all ${
                    isUploading ? "cursor-wait opacity-50" : "hover:border-[#097fe8] hover:bg-[#f2f9ff]"
                  }`}
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] bg-white">
                    {isUploading ? <Loader className="h-7 w-7 animate-spin text-[#097fe8]" /> : <Upload className="h-7 w-7 text-[#097fe8]" />}
                  </div>
                  <h4 className="text-lg font-bold text-[rgba(0,0,0,0.95)]">{isUploading ? "Processing master data..." : "Drop student master Excel"}</h4>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-[#615d59]">Supported formats: .xlsx, .xls, .csv</p>
                  <button
                    type="button"
                    disabled={isUploading}
                    className="mt-5 rounded bg-[#0075de] px-5 py-2 text-sm font-semibold text-white hover:bg-[#005bab]"
                  >
                    {isUploading ? "Uploading..." : "Select file"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PrincipalLayout>
  );
};

export default PrincipalDashboardPage;
