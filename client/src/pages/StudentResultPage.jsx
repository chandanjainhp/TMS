import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Search, RefreshCw, AlertCircle, ArrowLeft, Download } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentResultPage = () => {
  const [usn, setUsn] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaChallenge, setCaptchaChallenge] = useState({ q: "", a: 0 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaChallenge({ q: `${num1} + ${num2}`, a: num1 + num2 });
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCheckResult = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!usn.trim()) {
      const msg = "Please enter your USN Number.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (parseInt(captchaInput, 10) !== captchaChallenge.a) {
      const msg = "Incorrect Captcha. Please try again.";
      setError(msg);
      toast.error(msg);
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/analytics/check-result", {
        usn: usn.trim(),
        captchaInput,
        captchaAnswer: captchaChallenge.a,
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success("Results fetched successfully!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch results. Please check your USN.";
      setError(msg);
      toast.error(msg);
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      doc.text("Student Result Statement", 105, 20, { align: "center" });
      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 25, 196, 25);

      doc.setFillColor(246, 245, 244);
      doc.roundedRect(14, 30, 182, 45, 3, 3, "F");

      doc.setFontSize(11);
      doc.setTextColor(97, 93, 89);
      doc.text("Student Name:", 20, 42);
      doc.text("USN:", 20, 52);
      doc.text("Department:", 100, 42);
      doc.text("Section:", 100, 52);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(result.studentDetails.name, 50, 42);
      doc.text(result.studentDetails.usn, 50, 52);
      doc.text(result.studentDetails.department, 130, 42);
      doc.text(result.studentDetails.section, 130, 52);
      doc.setFont(undefined, "normal");

      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text("The following results are generated based on internal assessments.", 20, 68);

      const tableBody = result.results.map((r, i) => [i + 1, r.testName, r.subject, r.totalMarks]);

      autoTable(doc, {
        startY: 85,
        head: [["#", "Assessment Name", "Subject", "Marks Obtained"]],
        body: tableBody,
        theme: "grid",
        headStyles: {
          fillColor: [0, 117, 222],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { cellWidth: 80 },
          3: { halign: "center", fontStyle: "bold" },
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
          valign: "middle",
        },
        alternateRowStyles: {
          fillColor: [249, 249, 249],
        },
      });

      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(140);
      for (let i = 1; i <= pageCount; i += 1) {
        doc.setPage(i);
        doc.text(`Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
      }

      doc.save(`Result_${result.studentDetails.usn}.pdf`);
      toast.success("Result downloaded successfully");
    } catch (pdfError) {
      console.error("PDF Generation Error", pdfError);
      toast.error("Failed to generate PDF");
    }
  };

  const total = result?.results?.reduce((sum, item) => sum + Number(item.totalMarks || 0), 0) || 0;
  const avg = result?.results?.length ? (total / result.results.length).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-[#f6f5f4] py-8">
      <div className="mx-auto w-full max-w-[900px] px-4">
        <Link to="/landing" className="mb-4 inline-flex items-center text-sm font-medium text-[#615d59] no-underline hover:text-[#0075de]">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px]">
          <div className="border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-6">
            <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-1px] text-[rgba(0,0,0,0.95)]">Student Results</h1>
            <p className="mt-2 text-[#615d59]">Enter your USN and complete verification to view performance.</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleCheckResult} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#615d59]">USN Number</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a39e98]" />
                  <input
                    type="text"
                    placeholder="Enter USN (e.g., 1MS21CS001)"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value.toUpperCase())}
                    className="w-full rounded border border-[rgba(0,0,0,0.1)] bg-white py-3 pl-10 pr-4 text-[rgba(0,0,0,0.95)] placeholder-[#a39e98] focus:border-[#097fe8] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#615d59]">Security Check</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] px-4 py-3 text-center font-mono text-lg tracking-wider text-[rgba(0,0,0,0.95)] select-none">
                    {captchaChallenge.q} = ?
                  </div>
                  <button type="button" onClick={generateCaptcha} className="rounded border border-[rgba(0,0,0,0.1)] bg-white p-3 text-[#615d59] hover:bg-[#f6f5f4]" title="Refresh Captcha">
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="number"
                  placeholder="Enter Answer"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="mt-3 w-full rounded border border-[rgba(0,0,0,0.1)] bg-white px-4 py-3 text-[rgba(0,0,0,0.95)] placeholder-[#a39e98] focus:border-[#097fe8] focus:outline-none"
                />
              </div>

              {error && (
                <div className="flex items-center rounded border border-[#f5c2c2] bg-[#fff5f5] p-3 text-sm text-[#dd5b00]">
                  <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded bg-[#0075de] py-3 font-semibold text-white transition-all hover:bg-[#005bab] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Check Results"}
              </button>
            </form>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="mt-6 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[rgba(0,0,0,0.04)_0px_4px_18px]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-6">
                <div>
                  <h2 className="text-xl font-bold text-[rgba(0,0,0,0.95)]">{result.studentDetails.name}</h2>
                  <p className="mt-1 text-sm text-[#615d59]">
                    {result.studentDetails.usn} · {result.studentDetails.department} · Section {result.studentDetails.section}
                  </p>
                </div>
                <button onClick={handleDownloadPDF} className="inline-flex items-center rounded border border-[rgba(0,0,0,0.1)] bg-white px-4 py-2 text-sm font-semibold text-[#0075de] hover:bg-[#f2f9ff]">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </button>
              </div>

              <div className="grid gap-4 border-b border-[rgba(0,0,0,0.1)] p-6 sm:grid-cols-2">
                <div className="rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-4">
                  <p className="text-xs uppercase tracking-[0.125px] text-[#615d59]">Total marks</p>
                  <p className="mt-1 text-3xl font-bold text-[rgba(0,0,0,0.95)]">{total}</p>
                </div>
                <div className="rounded border border-[rgba(0,0,0,0.1)] bg-[#f6f5f4] p-4">
                  <p className="text-xs uppercase tracking-[0.125px] text-[#615d59]">Average</p>
                  <p className="mt-1 text-3xl font-bold text-[rgba(0,0,0,0.95)]">{avg}</p>
                </div>
              </div>

              <div className="overflow-x-auto p-6">
                <table className="w-full min-w-[560px] border border-[rgba(0,0,0,0.1)] text-left">
                  <thead className="bg-[#f6f5f4]">
                    <tr>
                      <th className="border-b border-[rgba(0,0,0,0.1)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">#</th>
                      <th className="border-b border-[rgba(0,0,0,0.1)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">Assessment</th>
                      <th className="border-b border-[rgba(0,0,0,0.1)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">Subject</th>
                      <th className="border-b border-[rgba(0,0,0,0.1)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.125px] text-[#615d59]">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.results.map((row, index) => (
                      <tr key={`${row.subject}-${row.testName}-${index}`} className="even:bg-[#f6f5f4]">
                        <td className="border-b border-[rgba(0,0,0,0.06)] px-3 py-2 text-sm text-[#615d59]">{index + 1}</td>
                        <td className="border-b border-[rgba(0,0,0,0.06)] px-3 py-2 text-sm text-[rgba(0,0,0,0.95)]">{row.testName}</td>
                        <td className="border-b border-[rgba(0,0,0,0.06)] px-3 py-2 text-sm text-[rgba(0,0,0,0.95)]">{row.subject}</td>
                        <td className="border-b border-[rgba(0,0,0,0.06)] px-3 py-2 text-sm font-semibold text-[rgba(0,0,0,0.95)]">{row.totalMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentResultPage;
