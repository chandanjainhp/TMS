import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { Search, Folder, FileText, ArrowLeft, Eye, Clock, User, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const RecordsList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { admin } = useAdminAuthStore();
  const isAdmin = user?.role === 'admin' || (admin && admin.role === 'admin');

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('folders'); // 'folders' or 'files'
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showDataModal, setShowDataModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch all records with publicView access
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Determine if we are in "Admin/Teacher Management" mode where we might want restricted views,
      // or "Student Repository" mode. User requested "all the update record" for "all the user page".
      // So we force publicView=true to get everything for the repository view.

      const response = await axios.get('http://localhost:5000/api/form/records', {
        params: { publicView: 'true' },
        withCredentials: true
      });

      if (response.data.success) {
        setRecords(response.data.data);
      } else {
        toast.error('Failed to load records');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Error loading records');
    } finally {
      setLoading(false);
    }
  };

  // Group records by Department
  const departments = records.reduce((acc, record) => {
    if (!acc.includes(record.department)) {
      acc.push(record.department);
    }
    return acc;
  }, []).sort();

  // Filter records for the current view
  const filteredRecords = selectedDepartment
    ? records.filter(r => r.department === selectedDepartment)
    : [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered lists based on search
  const filteredDepartments = departments.filter(d =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFiles = filteredRecords.filter(r =>
    r.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFolderClick = (dept) => {
    setSelectedDepartment(dept);
    setCurrentView('files');
    setSearchTerm(''); // Clear search when diving in
  };

  const handleBack = () => {
    setSelectedDepartment(null);
    setCurrentView('folders');
    setSearchTerm('');
  };

  const openDataModal = (record) => {
    setSelectedRecord(record);
    setShowDataModal(true);
  };

  return (
    <div className="w-full min-h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {currentView === 'files' && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentView === 'folders' ? 'Student Records' : selectedDepartment}
            </h2>
            <p className="text-sm text-gray-500">
              {currentView === 'folders'
                ? 'Browse updated records by department'
                : `${filteredFiles.length} file${filteredFiles.length !== 1 ? 's' : ''} available`
              }
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={currentView === 'folders' ? "Search departments..." : "Search files..."}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-100 border-t-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Folders View */}
          {currentView === 'folders' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDepartments.map((dept, idx) => {
                const count = records.filter(r => r.department === dept).length;
                return (
                  <div
                    key={idx}
                    onClick={() => handleFolderClick(dept)}
                    className="group cursor-pointer p-5 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex items-start gap-4"
                  >
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                      <Folder className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {dept}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {count} file{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}

              {filteredDepartments.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No departments found.
                </div>
              )}
            </div>
          )}

          {/* Files Table View */}
          {currentView === 'files' && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Section</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Test Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredFiles.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-50 text-orange-600 rounded">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">{record.subject || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{record.section}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-700">{record.year}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{record.teacherName}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{record.aiTestDate}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button
                            onClick={() => openDataModal(record)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p>No records found in this folder.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Data View Modal */}
      {showDataModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-0 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Record Data</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedRecord.department} • Section {selectedRecord.section}</p>
              </div>
              <button
                onClick={() => {
                  setShowDataModal(false);
                  setSelectedRecord(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Year</span>
                  <p className="font-semibold text-gray-900">{selectedRecord.year}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Teacher</span>
                  <p className="font-semibold text-gray-900">{selectedRecord.teacherName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Test Date</span>
                  <p className="font-semibold text-gray-900">{selectedRecord.aiTestDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Upload Date</span>
                  <p className="font-semibold text-gray-900">{new Date(selectedRecord.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-100/50">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> CSV Content
                  </h4>
                </div>
                {selectedRecord.csvData && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          {Object.keys(selectedRecord.csvData).map(key => (
                            <th key={key} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          {Object.values(selectedRecord.csvData).map((value, index) => (
                            <td key={index} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {value}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => {
                  setShowDataModal(false);
                  setSelectedRecord(null);
                }}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsList;
