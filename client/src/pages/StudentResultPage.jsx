import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Search, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
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
        if (parseInt(captchaInput) !== captchaChallenge.a) {
            const msg = "Incorrect Captcha. Please try again.";
            setError(msg);
            toast.error(msg);
            generateCaptcha();
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/analytics/check-result", {
                usn: usn.trim(),
                captchaInput,
                captchaAnswer: captchaChallenge.a
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

            // Header
            doc.setFontSize(22);
            doc.setTextColor(40, 40, 40);
            doc.text("Student Result Statement", 105, 20, { align: "center" });

            // Branding line
            doc.setLineWidth(0.5);
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 25, 196, 25);

            // Student Info Box
            doc.setFillColor(247, 247, 247);
            doc.roundedRect(14, 30, 182, 45, 3, 3, 'F');

            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            doc.text("Student Name:", 20, 42);
            doc.text("USN:", 20, 52);
            doc.text("Department:", 100, 42);
            doc.text("Section:", 100, 52);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text(result.studentDetails.name, 50, 42);
            doc.text(result.studentDetails.usn, 50, 52);
            doc.text(result.studentDetails.department, 130, 42);
            doc.text(result.studentDetails.section, 130, 52);
            doc.setFont(undefined, 'normal');

            // Disclaimer
            doc.setFontSize(9);
            doc.setTextColor(128, 128, 128);
            doc.text("The following results are generated based on the internal assessments.", 20, 68);

            // Table
            const tableBody = result.results.map((r, i) => [
                i + 1,
                r.testName,
                r.subject,
                r.totalMarks
            ]);

            autoTable(doc, {
                startY: 85,
                head: [['#', 'Assessment Name', 'Subject', 'Marks Obtained']],
                body: tableBody,
                theme: 'grid',
                headStyles: {
                    fillColor: [79, 70, 229], // Indigo-600
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 15 },
                    1: { cellWidth: 60 },
                    2: { cellWidth: 80 },
                    3: { halign: 'center', fontStyle: 'bold' }
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 5,
                    valign: 'middle'
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251] // Gray-50
                }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
            }

            doc.save(`Result_${result.studentDetails.usn}.pdf`);
            toast.success("Result downloaded successfully");
        } catch (error) {
            console.error("PDF Generation Error", error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-outfit relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">

                <div className="w-full max-w-lg">
                    <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                    Student Results
                                </h1>
                                <p className="text-gray-400 mt-2">Enter your USN to check your performance</p>
                            </div>

                            <form onSubmit={handleCheckResult} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">USN Number</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Enter USN (e.g., 1MS21CS001)"
                                            value={usn}
                                            onChange={(e) => setUsn(e.target.value.toUpperCase())}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Security Check</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl py-3 px-4 text-center font-mono text-lg tracking-wider text-gray-300 select-none">
                                            {captchaChallenge.q} = ?
                                        </div>
                                        <button
                                            type="button"
                                            onClick={generateCaptcha}
                                            className="p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors text-gray-300"
                                            title="Refresh Captcha"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Enter Answer"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        className="w-full mt-3 bg-gray-900/50 border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Check Results"}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Results Display */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-8 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-6 border-b border-gray-700/50 bg-gray-800/80">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold text-white mb-1">{result.studentDetails.name}</h2>
                                            <p className="text-sm text-gray-400 font-mono">{result.studentDetails.usn}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">{result.studentDetails.department} - {result.studentDetails.section}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Visual Analytics */}
                                    <div className="mb-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Performance Trends</h3>
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={result.results.slice().reverse()}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                                    <XAxis dataKey="testName" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                                        itemStyle={{ color: '#F3F4F6' }}
                                                        cursor={{ fill: '#374151', opacity: 0.4 }}
                                                    />
                                                    <Bar dataKey="totalMarks" name="Marks Obtained" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Exam Performance</h3>

                                    <div className="space-y-4">
                                        {result.results.map((record, index) => (
                                            <div key={index} className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-white">{record.testName}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${parseFloat(record.totalMarks) >= 70 ? 'bg-green-500/10 text-green-400' :
                                                        parseFloat(record.totalMarks) >= 40 ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-red-500/10 text-red-400'
                                                        }`}>
                                                        {record.totalMarks} Marks
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>{record.subject}</span>
                                                    <span>{index === 0 ? "Latest" : ""}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Download className="w-4 h-4 mr-2" /> Download/Print Result PDF
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StudentResultPage;
