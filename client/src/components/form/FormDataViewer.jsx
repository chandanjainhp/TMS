import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ListFilter,
  Trash,
  ScanEye,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  FileSpreadsheet,
  CalendarRange,
  Building2,
  Network,
  Scroll,
  Pencil,
  Save,
  RotateCcw,
  BookOpenCheck,
  Users2,
  UserCircle2,
  ClipboardList,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';

const FormDataViewer = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    section: '',
    year: '',
    branch: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDataModal, setShowDataModal] = useState(false);

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({});

  const itemsPerPage = 8;

  useEffect(() => {
    fetchRecords();
  }, [filters]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v)
      );

      const response = await axios.get('http://localhost:5000/api/form/records', { params });
      if (response.data.success) {
        setRecords(response.data.data);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch records');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ department: '', section: '', year: '', branch: '' });
    setSearchTerm('');
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this record irreversibly?')) return;
    try {
      setLoading(true);
      const res = await axios.delete(`http://localhost:5000/api/form/records/${id}`);
      if (res.data.success) {
        setRecords(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      setError('Deletion failed');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (record) => {
    setEditingRecord(record);
    // Flatten structure for easier editing form
    setEditForm({
      ...record.originalRecord,
      ...record.fullCsv // Spread CSV data at top level for easy access, but we'll need to reconstruct on save
    });
    setShowEditModal(true);
  };

  const handleEditChange = (key, value) => {
    setEditForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    try {
      setLoading(true);

      // Separate top-level fields from CSV data
      const topLevelFields = ['department', 'branch', 'section', 'year', 'semester', 'teacherName', 'aiTestDate'];

      const recordUpdate = {};
      const csvDataUpdate = {};

      Object.entries(editForm).forEach(([key, value]) => {
        if (topLevelFields.includes(key)) {
          recordUpdate[key] = value;
        } else if (key !== '_id' && key !== 'csvData' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
          // Assume everything else belongs to CSV Data
          // We need to map back to the original CSV keys if possible, or just use the keys from editForm
          // Let's filter out keys that we KNOW are from the flattened view but not in CSV
          const derivedKeys = ['slNo', 'originalRecord', 'fullCsv', 'totalMarks', 'attendance', 'name', 'usn'];
          // Note: name, usn are in derived but also likely in CSV. We should prefer the CSV key if it exists.

          // Better approach: Iterate over the original CSV keys from editingRecord.fullCsv and get values from editForm
          if (editingRecord.fullCsv && Object.prototype.hasOwnProperty.call(editingRecord.fullCsv, key)) {
            csvDataUpdate[key] = value;
          } else if (key === 'c1' || key === 'c2' || key === 'totalMarks' || key === 'attendance') {
            // Allow editing these common fields even if casing matches simplified view
            csvDataUpdate[key] = value;
            // Also might need to map 'totalMarks' back to 'Total Marks' if that's the CSV key
            Object.keys(editingRecord.fullCsv).forEach(originalKey => {
              if (originalKey.toLowerCase().replace(/\s/g, '') === key.toLowerCase()) {
                csvDataUpdate[originalKey] = value;
              }
            });
          }
        }
      });

      // Fallback: simple merge of what's in editForm that matches original CSV keys
      const finalCsvData = { ...editingRecord.fullCsv };
      Object.keys(finalCsvData).forEach(k => {
        if (editForm[k] !== undefined) {
          finalCsvData[k] = editForm[k];
        }
      });

      const payload = {
        ...recordUpdate,
        csvData: finalCsvData
      };

      const response = await axios.put(`http://localhost:5000/api/form/records/${editingRecord._id}`, payload);

      if (response.data.success) {
        // Update local state
        setRecords(prev => prev.map(r => r._id === editingRecord._id ? response.data.data : r));
        setShowEditModal(false);
        setEditingRecord(null);
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (err) {
      console.error("Update error", err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePDFExport = () => {
    const doc = new jsPDF('landscape');
    doc.text('Student Assessment Records', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 24);

    const tableColumn = [
      'Name', 'USN', 'Department', 'Year', 'Branch', 'Total Marks', 'Attendance'
    ];

    const tableRows = filteredRecords.map(r => [
      r.name, r.usn, r.department, r.year, r.branch, r.totalMarks, r.attendance
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });
    doc.save('student_records.pdf');
  };

  const flattenedRecords = useMemo(() => records.map((record, index) => {
    const csv = record.csvData || {};
    return {
      _id: record._id,
      slNo: index + 1,
      name: csv.Name || csv.name || 'N/A',
      usn: csv.USN || csv.usn || 'N/A',
      department: record.department || csv.Department || 'N/A',
      year: record.year || csv.Year || 'N/A',
      branch: record.branch || csv.Branch || 'N/A',
      section: record.section || csv.Section || 'N/A',
      totalMarks: csv['Total Marks'] || csv.totalMarks || csv['totalMarks'] || '-',
      attendance: csv.Attendance || csv.attendance || '-',
      c1: csv.C1 || csv.c1 || '-',
      c2: csv.C2 || csv.c2 || '-',
      assignMarks: csv['Assign Marks'] || csv.assignMarks || csv['assignMarks'] || '-',
      recordMarks: csv['Record Marks'] || csv.recordMarks || csv['recordMarks'] || '-',
      c2Lab: csv['C2 Lab'] || csv.c2Lab || csv['c2Lab'] || '-',
      c1Date: csv['C1 Date'] || csv.c1Date || csv['c1Date'] || '-',
      c2Date: csv['C2 Date'] || csv.c2Date || csv['c2Date'] || '-',
      originalRecord: record,
      fullCsv: csv
    };
  }), [records]);

  const filteredRecords = useMemo(() => flattenedRecords.filter(r =>
    Object.values(r).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [flattenedRecords, searchTerm]);

  const uniqueDepts = [...new Set(records.map(r => r.department).filter(Boolean))];
  const uniqueYears = [...new Set(records.map(r => r.year).filter(Boolean))];

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Submission History</h1>
            <p className="text-gray-500 mt-0.5 flex items-center gap-2 text-sm">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                {filteredRecords.length}
              </span>
              total entries found
            </p>
          </div>
          <div className="flex gap-2">
            <CSVLink
              data={filteredRecords}
              filename="student_records.csv"
              className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-medium border border-emerald-200 text-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </CSVLink>
            <button
              onClick={handlePDFExport}
              className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors font-medium border border-rose-200 text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, USN, departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-w-[130px] text-sm"
              >
                <option value="">All Depts</option>
                {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-w-[110px] text-sm"
              >
                <option value="">All Years</option>
                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Records Table */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p>Loading data...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <Search className="w-12 h-12 mb-2 opacity-20" />
            <p>No matching records found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-3 whitespace-nowrap">Name / USN</th>
                    <th className="px-3 py-3 whitespace-nowrap">Dept</th>
                    <th className="px-3 py-3 whitespace-nowrap">Year</th>
                    <th className="px-3 py-3 whitespace-nowrap">Branch</th>
                    <th className="px-3 py-3 whitespace-nowrap">Section</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">C1</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">C2</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">Assign</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">Record</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">C2 Lab</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">Attend %</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">Total</th>
                    <th className="px-3 py-3 text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {currentRecords.map((record) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={record._id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-3 py-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-xs">{record.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{record.usn}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{record.department}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{record.year}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{record.branch}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{record.section}</td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-xs font-medium text-gray-700">{record.c1 || '-'}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-xs font-medium text-gray-700">{record.c2 || '-'}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-xs font-medium text-gray-700">{record.assignMarks || '-'}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-xs font-medium text-gray-700">{record.recordMarks || '-'}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-xs font-medium text-gray-700">{record.c2Lab || '-'}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-xs font-medium ${Number(record.attendance) >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {record.attendance || '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${Number(record.totalMarks) >= 200
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                            }`}>
                            {record.totalMarks}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => startEditing(record)}
                              className="p-1 rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                              title="Edit Record"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setSelectedRecord(record); setShowDataModal(true); }}
                              className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                              title="View All Details"
                            >
                              <ScanEye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record._id)}
                              className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Delete Record"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 mb-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDataModal && selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDataModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedRecord.name}</h2>
                  <p className="text-indigo-600 font-medium text-sm">{selectedRecord.usn}</p>
                </div>
                <button
                  onClick={() => setShowDataModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Academic Info</p>
                    <div className="space-y-0.5 text-sm">
                      <p><span className="text-gray-500">Dept:</span> {selectedRecord.department}</p>
                      <p><span className="text-gray-500">Year:</span> {selectedRecord.year}</p>
                      <p><span className="text-gray-500">Branch:</span> {selectedRecord.branch}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50/50 p-3 rounded-xl">
                    <p className="text-xs text-indigo-400 uppercase font-semibold mb-1">Performance</p>
                    <div className="space-y-0.5 text-sm">
                      <p><span className="text-indigo-600/70">C1:</span> {selectedRecord.c1}</p>
                      <p><span className="text-indigo-600/70">C2:</span> {selectedRecord.c2}</p>
                      <p className="font-bold text-indigo-700 mt-0.5">Total: {selectedRecord.totalMarks}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Full CSV Data
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-3 py-2">Field</th>
                        <th className="px-3 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.entries(selectedRecord.fullCsv).map(([k, v]) => (
                        <tr key={k} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2 text-gray-500 font-medium">{k}</td>
                          <td className="px-3 py-2 text-gray-800">{String(v || '-')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-indigo-600" />
                  Edit Record
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-4">

                {/* Academic Info Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={editForm.department || ''}
                        onChange={(e) => handleEditChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Branch</label>
                      <input
                        type="text"
                        value={editForm.branch || ''}
                        onChange={(e) => handleEditChange('branch', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                      <select
                        value={editForm.year || ''}
                        onChange={(e) => handleEditChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      >
                        <option value="">Select Year</option>
                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Section</label>
                      <input
                        type="text"
                        value={editForm.section || ''}
                        onChange={(e) => handleEditChange('section', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* CSV Data Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Student Data
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2 w-1/3">Field</th>
                          <th className="px-3 py-2 w-2/3">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {editingRecord.fullCsv && Object.entries(editingRecord.fullCsv).map(([key, value]) => (
                          <tr key={key} className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 text-gray-700 font-medium">{key}</td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={editForm[key] !== undefined ? editForm[key] : (value || '')}
                                onChange={(e) => handleEditChange(key, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all bg-transparent focus:bg-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm flex items-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormDataViewer;
