import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import {
  CloudUpload,
  CheckCircle2,
  AlertOctagon,
  UserCircle2,
  CalendarRange,
  Users2,
  Building2,
  Network,
  Scroll,
  BookOpenCheck,
  CalendarClock,
  ClipboardList,
  GraduationCap,
  BookOpen,
  BookCopy
} from 'lucide-react';

const DepartmentUploadForm = () => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    department: '',
    branch: '',
    section: '',
    year: '',
    semester: '',
    subject: '',
    subSubject: '',
    teacherName: '',
    aiTestDate: '',
    testType: 'A1',
    csvFile: null
  });

  // Auto-populate teacher name from logged-in user
  useEffect(() => {
    if (user && user.name) {
      setFormData(prev => ({
        ...prev,
        teacherName: user.name
      }));
    }
  }, [user]);

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const departments = [
    'Physics', 'Mathematics', 'Electronics', 'Computer Science', 'Chemistry', 'Biology'
  ];

  const branches = [
    'PMCS', 'BCA', 'PME', 'PCM'
  ];

  const years = ['1', '2', '3'];
  const semesters = ['1', '2', '3', '4', '5', '6'];

  // Dynamic Subjects State
  const [subjectList, setSubjectList] = useState([]);
  const [subSubjectOptions, setSubSubjectOptions] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Fetch subjects when Branch or Semester changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.branch || !formData.semester) {
        setSubjectList([]);
        return;
      }

      setLoadingSubjects(true);
      try {
        const res = await axios.get(`/api/subjects?branch=${formData.branch}&semester=${formData.semester}`, { withCredentials: true });
        if (res.data.success) {
          // Store full subject objects
          if (res.data.data.length === 0) {
            setSubjectList([]);
          } else {
            setSubjectList(res.data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch subjects", error);
        // Fallback to empty
        setSubjectList([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [formData.branch, formData.semester]);

  const sections = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (files && files[0]) setError(null);
    else if (!files) setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      if (e.currentTarget.contains(e.relatedTarget)) return;
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.csv') || file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
        setFormData(prev => ({ ...prev, csvFile: file }));
        setError(null);
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };

  const validateForm = () => {
    if (!formData.department) return setError('Please select a department');
    if (!formData.branch) return setError('Please select a branch');
    if (!formData.year) return setError('Please select a year');
    if (!formData.semester) return setError('Please select a semester');
    if (!formData.subject) return setError('Please select a subject');
    if (!formData.subSubject) return setError('Please enter sub-subject');
    if (!formData.teacherName.trim()) return setError('Please enter teacher name');
    if (!/^[a-zA-Z\s.\-']+$/.test(formData.teacherName.trim())) return setError('Teacher name should only contain letters, spaces, dots, hyphens, or apostrophes');
    if (!formData.section) return setError('Please select a section');
    if (!formData.aiTestDate) return setError('Please select AI test date');

    const testDate = new Date(formData.aiTestDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (testDate > today) return setError('Test date cannot be in the future');

    if (!formData.csvFile) return setError('Please upload a CSV file');
    if (!formData.csvFile.name.toLowerCase().endsWith('.csv') && formData.csvFile.type !== "text/csv") return setError('Only CSV files are allowed');
    if (formData.csvFile.size > 10 * 1024 * 1024) return setError('File size should not exceed 10MB');

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post(
        '/api/form',
        formDataToSend,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        }
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData(prev => ({
        ...prev,
        csvFile: null,
        department: '', branch: '', section: '', year: '', semester: '', subject: '', subSubject: '', teacherName: user?.name || '', aiTestDate: '', testType: 'A1'
      }));

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      setError(msg);
      setDebugInfo(err.response || {});
    } finally {
      setIsUploading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const InputField = ({ label, icon: Icon, children }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 ml-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 pt-20">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header - Simple & Clean */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Score Entry</h1>
            <p className="text-gray-500 mt-1">Record academic assessments and test scores into the ledger.</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-xs font-mono text-gray-400">SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SECTION 1: Academic Context */}
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
              1. Academic Context
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Row 1 */}
              <InputField label="Department" icon={Building2}>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium text-gray-700"
                >
                  <option value="">Select Dept</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </InputField>

              <InputField label="Branch" icon={Network}>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium text-gray-700"
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </InputField>

              <InputField label="Year" icon={CalendarRange}>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium text-gray-700"
                >
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </InputField>

              <InputField label="Semester" icon={GraduationCap}>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium text-gray-700"
                >
                  <option value="">Select Sem</option>
                  {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>

              {/* Row 2 */}
              <InputField label="Subject" icon={BookOpen}>
                {loadingSubjects ? (
                  <div className="px-4 py-3 bg-gray-50 text-gray-400 rounded-xl border border-gray-200 text-sm">Loading...</div>
                ) : (
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => {
                      const selectedSubjName = e.target.value;
                      const selectedSubjObj = subjectList.find(s => s.name === selectedSubjName);
                      setFormData(prev => ({
                        ...prev,
                        subject: selectedSubjName,
                        subSubject: ''
                      }));
                      if (selectedSubjObj && selectedSubjObj.subSubjects && selectedSubjObj.subSubjects.length > 0) {
                        setSubSubjectOptions(selectedSubjObj.subSubjects);
                      } else {
                        setSubSubjectOptions([]);
                      }
                    }}
                    disabled={!formData.branch || !formData.semester}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {!formData.branch || !formData.semester
                        ? "Select Branch & Sem first"
                        : subjectList.length === 0 ? "No subjects found" : "Select Subject"}
                    </option>
                    {subjectList.map((subj, index) => <option key={index} value={subj.name}>{subj.name} ({subj.code})</option>)}
                  </select>
                )}
              </InputField>

              <InputField label="Section" icon={Users2}>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none font-medium text-gray-700"
                >
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </InputField>

              <InputField label="Teacher Name" icon={UserCircle2}>
                <input
                  type="text"
                  name="teacherName"
                  value={formData.teacherName}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium shadow-inner"
                />
              </InputField>

              <InputField label="Test Date" icon={CalendarClock}>
                <input
                  type="date"
                  name="aiTestDate"
                  value={formData.aiTestDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium text-gray-700"
                />
              </InputField>
            </div>
          </div>

          {/* SECTION 2: Assessment Type */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-500" />
              2. Select Assessment Type
            </h3>

            <div className="flex flex-wrap gap-3">
              {[
                { id: 'A1', label: 'A1', sub: 'max 20' },
                { id: 'A2', label: 'A2', sub: 'max 20' },
                { id: 'Assignment', label: 'Assignment', sub: 'max 10' },
                { id: 'Record', label: 'Record', sub: 'max 10' },
                { id: 'Lab', label: 'Lab', sub: 'max 25' },
                { id: 'Attendance', label: 'Attendance', sub: 'max 5' },
                { id: 'EndSem', label: 'End Sem', sub: 'Final' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, testType: type.id }))}
                  className={`relative flex flex-col items-start justify-center p-4 rounded-xl border-2 transition-all duration-200 min-w-[120px] flex-1 text-left group ${formData.testType === type.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md ring-1 ring-indigo-200'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                >
                  <span className={`text-base font-bold ${formData.testType === type.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                    {type.label}
                  </span>
                  <span className={`text-xs mt-1 ${formData.testType === type.id ? 'text-indigo-500 font-medium' : 'text-gray-400 group-hover:text-gray-500'}`}>
                    {type.sub}
                  </span>

                  {formData.testType === type.id && (
                    <div className="absolute top-2 right-2 text-indigo-600 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>



          {/* Upload & Submit Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <div className="lg:col-span-3">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center cursor-pointer group ${dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : formData.csvFile
                    ? 'border-emerald-500 bg-emerald-50/30'
                    : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="csvFile"
                  accept=".csv"
                  onChange={handleChange}
                  className="hidden"
                />

                <div className="flex flex-row items-center justify-center gap-4 pointer-events-none">
                  <div className={`p-4 rounded-xl transition-colors ${formData.csvFile ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50'}`}>
                    {formData.csvFile ? <CheckCircle2 className="w-8 h-8" /> : <CloudUpload className="w-8 h-8" />}
                  </div>

                  <div className="text-left">
                    {formData.csvFile ? (
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{formData.csvFile.name}</p>
                        <p className="text-sm text-gray-500">{(formData.csvFile.size / 1024).toFixed(2)} KB • Ready to upload</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-gray-700 text-lg group-hover:text-indigo-700 transition-colors">
                          Drop CSV file here
                        </p>
                        <p className="text-sm text-gray-400">or click to browse • Max 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
                {formData.csvFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData(prev => ({ ...prev, csvFile: null }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-4 right-4 text-xs font-bold text-rose-500 hover:text-rose-700 bg-white px-2 py-1 rounded-md shadow-sm border border-rose-100"
                  >
                    REMOVE
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col justify-end">
              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl flex items-start gap-2 text-sm font-medium"
                  >
                    <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isUploading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 ${isUploading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                  }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Upload Data</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Subject File Upload Removed */}
          </div>

        </form>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 ring-4 ring-emerald-100"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Success!</h4>
              <p className="text-emerald-100">Student records have been uploaded.</p>
            </div>
            <a href="/repository" className="ml-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
              View
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default DepartmentUploadForm;