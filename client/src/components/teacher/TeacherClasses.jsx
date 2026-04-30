import { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Users, ArrowRight, Loader2, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const DEPT_COLORS = [
  { bg: "#f2f9ff", text: "#097fe8" },
  { bg: "#f0fdf4", text: "#1aae39" },
  { bg: "#fff7ed", text: "#dd5b00" },
  { bg: "#f5f0ff", text: "#391c57" },
  { bg: "#f0fdfa", text: "#2a9d99" },
];

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/teacher/my-classes", { withCredentials: true })
      .then((res) => {
        if (res.data.success) setClasses(res.data.classes ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-[#097fe8]" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[rgba(0,0,0,0.1)] bg-white py-16 text-center shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f6f5f4]">
          <BookOpen className="h-6 w-6 text-[#a39e98]" />
        </div>
        <h3 className="text-sm font-semibold text-[rgba(0,0,0,0.95)]">No classes yet</h3>
        <p className="mt-1 text-xs text-[#615d59]">Upload records to see your classes here.</p>
        <Link
          to="/score-entry"
          className="mt-4 inline-flex items-center gap-1.5 rounded bg-[#0075de] px-3 py-1.5 text-xs font-semibold text-white no-underline transition-colors hover:bg-[#005bab]"
        >
          <Upload size={12} />
          Upload Records
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.125px] text-[#a39e98]">
          {classes.length} class{classes.length !== 1 ? "es" : ""} found
        </p>
        <Link
          to="/score-entry"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0075de] no-underline hover:underline"
        >
          <Upload size={11} /> Upload more
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls, i) => {
          const color = DEPT_COLORS[i % DEPT_COLORS.length];
          return (
            <div
              key={cls.id}
              className="group overflow-hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px] transition-all hover:shadow-[rgba(0,0,0,0.08)_0px_8px_24px]"
            >
              {/* Color accent bar */}
              <div className="h-1 w-full" style={{ background: color.text }} />

              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[rgba(0,0,0,0.95)]">{cls.subject}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[#615d59]">
                      {cls.department} · {cls.name}
                    </p>
                  </div>
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: color.bg, color: color.text }}
                  >
                    <BookOpen size={14} />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.06)] pt-3">
                  <div className="flex items-center gap-1 text-[11px] text-[#615d59]">
                    <Users size={11} />
                    <span>{cls.students} student{cls.students !== 1 ? "s" : ""}</span>
                  </div>
                  {cls.semester && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{ background: color.bg, color: color.text }}
                    >
                      Sem {cls.semester}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherClasses;
