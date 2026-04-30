import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, BookOpen, Users, Loader2, Search } from "lucide-react";

const BAR_COLORS = ["#0075de", "#097fe8", "#2a9d99", "#1aae39", "#dd5b00", "#391c57"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
      <p className="text-[11px] font-semibold text-[rgba(0,0,0,0.95)]">{label}</p>
      <p className="text-[11px] text-[#615d59]">Avg: <span className="font-bold text-[#0075de]">{payload[0].value?.toFixed(1)}</span></p>
    </div>
  );
};

const TeacherAnalytics = () => {
  const [usn, setUsn]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  // Class-level subject performance (no filter — teacher's overall view)
  const [classData, setClassData]         = useState(null);
  const [classLoading, setClassLoading]   = useState(true);

  useEffect(() => {
    axios
      .get("/api/analytics/class-performance", { withCredentials: true })
      .then((res) => {
        if (res.data.success) setClassData(res.data.data);
      })
      .catch(() => {})
      .finally(() => setClassLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!usn.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await axios.get(`/api/analytics/student-performance?usn=${encodeURIComponent(usn.trim())}`, {
        withCredentials: true,
      });
      if (res.data.success) setResult(res.data.data);
      else setError(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "No records found for this USN.");
    } finally {
      setLoading(false);
    }
  };

  const subjectPerf = classData?.subjectPerformance ?? [];
  const stats       = classData?.stats ?? {};

  return (
    <div className="space-y-5">

      {/* Class-level overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Records",  value: stats.totalRecords,              color: "#0075de", bg: "#f2f9ff" },
          { label: "Class Average",  value: stats.avgTotalMarks?.toFixed(1), color: "#1aae39", bg: "#f0fdf4" },
          { label: "Highest Score",  value: stats.maxTotalMarks,             color: "#2a9d99", bg: "#f0fdfa" },
          { label: "Lowest Score",   value: stats.minTotalMarks,             color: "#dd5b00", bg: "#fff7ed" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-4 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">{label}</p>
              <p className="mt-1 text-xl font-bold leading-none text-[rgba(0,0,0,0.95)]">
                {classLoading ? "—" : (value ?? "—")}
              </p>
            </div>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: bg, color }}
            >
              <TrendingUp size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Subject performance bar chart */}
      {!classLoading && subjectPerf.length > 0 && (
        <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={15} className="text-[#097fe8]" />
            <p className="text-sm font-bold text-[rgba(0,0,0,0.95)]">Subject Performance</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectPerf} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="_id"
                tick={{ fontSize: 10, fill: "#a39e98" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-20}
                dy={8}
              />
              <YAxis tick={{ fontSize: 10, fill: "#a39e98" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgMarks" radius={[4, 4, 0, 0]} barSize={32}>
                {subjectPerf.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Student USN lookup */}
      <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <div className="mb-4 flex items-center gap-2">
          <Users size={15} className="text-[#097fe8]" />
          <p className="text-sm font-bold text-[rgba(0,0,0,0.95)]">Student Lookup</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a39e98]" />
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              placeholder="Enter student USN…"
              className="w-full rounded border border-[rgba(0,0,0,0.1)] bg-white py-2 pl-8 pr-3 text-sm text-[rgba(0,0,0,0.95)] outline-none placeholder:text-[#a39e98] focus:border-[#097fe8]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-[#0075de] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005bab] disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Search"}
          </button>
        </form>

        {error && (
          <p className="mt-3 rounded bg-[#fff7ed] px-3 py-2 text-xs text-[#dd5b00]">{error}</p>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            {/* Student info */}
            <div className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-4 py-3">
              <p className="text-xs font-bold text-[rgba(0,0,0,0.95)]">{result.studentDetails?.name || "—"}</p>
              <p className="text-[11px] text-[#615d59]">
                USN: {result.studentDetails?.usn || usn} · {result.studentDetails?.department} · Sec {result.studentDetails?.section}
              </p>
            </div>

            {/* Subject-wise performance */}
            {Object.entries(result.subjectWisePerformance ?? {}).map(([subject, entries]) => (
              <div key={subject} className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-3">
                <p className="mb-2 text-xs font-semibold text-[rgba(0,0,0,0.95)]">{subject}</p>
                <div className="flex flex-wrap gap-2">
                  {entries.map((e, i) => (
                    <div
                      key={i}
                      className="rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-2.5 py-1.5 text-center"
                    >
                      <p className="text-base font-bold text-[rgba(0,0,0,0.95)]">{e.marks}</p>
                      <p className="text-[10px] text-[#a39e98]">{e.testName}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAnalytics;
