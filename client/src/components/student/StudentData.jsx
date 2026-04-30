import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const StudentData = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/students/students");
        const apiData = response.data;

        const formattedStudents = apiData.map((student, index) => {
       
          const getValue = (value, isNumber = false, isDate = false) => {
            if (value === null || value === undefined || value === "") {
              return isNumber ? 0 : "N/A";
            }
            
            if (isDate) {
              try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString();
                }
                return value; // Return original if not a valid date
              } catch {
                return value; 
              }
            }
            
            return isNumber ? Number(value) : value;
          };

      
          return {
            slNo: index + 1,
            name: getValue(student.Name),
            usn: getValue(student.USN),
            activity: getValue(student.Activity),
            c1: getValue(student.C1, true),
            c1Date: getValue(student["C1 Date"], false, true),
            assignMarks: getValue(student["Assign Marks"], true),
            c2: getValue(student.C2, true),
            c2Date: getValue(student["C2 Date"], false, true),
            attendance: getValue(student.Attendance),
            recordMarks: getValue(student["Record Marks"], true),
            c2Lab: getValue(student["C2 Lab"]),
            totalMarks: getValue(student["Total Marks"]),
            department: getValue(student.Department),
            year: getValue(student.Year),
            branch: getValue(student.Branch)
          };
        });

        setStudents(formattedStudents);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.text("Internal Assessment", 20, 10);
    autoTable(doc, {
      head: [["Sl No.", "Name", "USN", "Activity", "C1", "C1 Date", "Assign", "C2", "C2 Date", 
             "Attendance", "Record", "C2 Lab", "Total", "Department", "Year", "Branch"]],
      body: filteredStudents.map(student => [
        student.slNo,
        student.name,
        student.usn,
        student.activity,
        student.c1 || "-",
        student.c1Date,
        student.assignMarks || "-",
        student.c2 || "-",
        student.c2Date,
        student.attendance,
        student.recordMarks || "-",
        student.c2Lab,
        student.totalMarks || "-",
        student.department,
        student.year,
        student.branch
      ])
    });
    doc.save("student_data.pdf");
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter === "" || student.department === departmentFilter) &&
    (yearFilter === "" || student.year === yearFilter) &&
    (branchFilter === "" || student.branch === branchFilter)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentItems = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueDepartments = [...new Set(students.map(student => student.department))].filter(Boolean);
  const uniqueYears = [...new Set(students.map(student => student.year))].filter(Boolean);
  const uniqueBranches = [...new Set(students.map(student => student.branch))].filter(Boolean);

  if (isLoading) {
    return (
      <div className="bg-[#34495E] p-4 mt-5 text-white text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent"></div>
        <p>Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#34495E] p-4 mt-5 text-red-400 text-center">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Define table headers explicitly
  const tableHeaders = [
    "Sl No.", "Name", "USN", "Activity", "C1", "C1 Date", "Assign Marks", 
    "C2", "C2 Date", "Attendance", "Record Marks", "C2 Lab", "Total Marks", 
    "Department", "Year", "Branch"
  ];

  // Define corresponding keys for accessing student data
  const dataKeys = [
    "slNo", "name", "usn", "activity", "c1", "c1Date", "assignMarks",
    "c2", "c2Date", "attendance", "recordMarks", "c2Lab", "totalMarks",
    "department", "year", "branch"
  ];

  return (
    <div className="bg-white p-4 mt-5 text-black">
      <h2 className="text-xl mb-4">Internal Assessment</h2>
      
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select 
          className="p-2 bg-gray-800 rounded w-full md:w-auto" 
          value={departmentFilter} 
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select 
          className="p-2 bg-gray-800 rounded w-full md:w-auto" 
          value={yearFilter} 
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select 
          className="p-2 bg-gray-800 rounded w-full md:w-auto" 
          value={branchFilter} 
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">All Branches</option>
          {uniqueBranches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      <input 
        type="text" 
        placeholder="Search by Name" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="bg-gray-800 text-white p-2 rounded w-full mb-4" 
      />
      
      <div className="flex gap-4 mb-4">
        <CSVLink 
          data={filteredStudents} 
          filename="student_data.csv" 
          className="bg-green-500 p-2 rounded text-center"
        >
          Export CSV
        </CSVLink>
        <button 
          onClick={handlePDFExport} 
          className="bg-red-500 p-2 rounded"
        >
          Export PDF
        </button>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center p-4 bg-gray-800 rounded">
          No students found matching the criteria
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full table-auto border-collapse mt-4">
              <thead>
                <tr className="bg-gray-700">
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="p-2 border">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((student, rowIndex) => (
                  <tr key={rowIndex} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                    {dataKeys.map((key, cellIndex) => (
                      <td key={cellIndex} className="p-2 border">
                        {student[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-700 p-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="bg-gray-700 p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden mt-4 space-y-4">
            {currentItems.map((student, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                {dataKeys.map((key, i) => (
                  <div key={i} className="flex justify-between mb-2">
                    <span className="text-gray-400">{tableHeaders[i]}:</span>
                    <span className="text-white">{student[key]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentData;