import { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const EditingStudentData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalStudents, setOriginalStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [showImportSave, setShowImportSave] = useState(false);

  const csvHeaders = [
    { label: "Sl No", key: "slNo" },
    { label: "Name", key: "name" },
    { label: "USN", key: "usn" },
    { label: "Activity", key: "activity" },
    { label: "C1", key: "c1" },
    { label: "C1 Date", key: "c1Date" },
    { label: "Assign Marks", key: "assignMarks" },
    { label: "C2", key: "c2" },
    { label: "C2 Date", key: "c2Date" },
    { label: "Attendance", key: "attendance" },
    { label: "Record Marks", key: "recordMarks" },
    { label: "C2 Lab", key: "c2Lab" },
    { label: "Total Marks", key: "totalMarks" },
    { label: "Department", key: "department" },
    { label: "Year", key: "year" },
    { label: "Branch", key: "branch" },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get("http://localhost:5000/api/editingstudents/editingstudents")
      .then(response => {
        const formattedData = response.data.map(student => ({
          ...student,
          c1: student.c1 || "N/A",
          c2: student.c2 || "N/A",
          assignMarks: student.assignMarks || "N/A",
          recordMarks: student.recordMarks || "N/A",
          totalMarks: student.totalMarks || "N/A",
        }));
        setStudents(formattedData);
        setOriginalStudents(formattedData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        alert("Failed to load student data");
      });
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const importedStudents = result.data.map((row, index) => ({
          slNo: index + 1,
          name: row.Name?.trim() || "N/A",
          usn: validateUSN(row.USN),
          activity: row.Activity?.trim() || "N/A",
          c1: parseNumber(row.C1, 0, 10),
          c1Date: validateDate(row.C1_Date),
          assignMarks: parseNumber(row.AssignMarks, 0, 10),
          c2: parseNumber(row.C2, 0, 10),
          c2Date: validateDate(row.C2_Date),
          attendance: validatePercentage(row.Attendance),
          recordMarks: parseNumber(row.RecordMarks, 0, 10),
          c2Lab: validatePercentage(row.C2Lab),
          totalMarks: parseNumber(row.TotalMarks, 0, 100),
          department: row.Department?.trim() || "N/A",
          year: row.Year?.trim() || "N/A",
          branch: row.Branch?.trim() || "N/A",
        }));

        validateImportedData(importedStudents);
        setOriginalStudents(students);
        setStudents(importedStudents);
        setShowImportSave(true);
      },
      error: (error) => {
        console.error("CSV error:", error);
        alert("Error parsing CSV file");
      }
    });
  };

  const parseNumber = (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max ? num : "N/A";
  };

  const validateDate = (dateString) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? dateString : "N/A";
  };

  const validatePercentage = (value) => {
    return /^\d{1,3}%$/.test(value) ? value : "N/A";
  };

  const validateUSN = (usn) => {
    return /^[a-zA-Z0-9]{10}$/.test(usn) ? usn.toUpperCase() : "N/A";
  };

  const validateImportedData = (importedStudents) => {
    const newErrors = {};
    importedStudents.forEach(student => {
      Object.entries(student).forEach(([key, value]) => {
        const error = validateField(key, value);
        if (error) newErrors[`${student.slNo}-${key}`] = error;
      });
    });
    setErrors(newErrors);
  };

  const validateField = (key, value) => {
    if (value === "N/A") return "";
    
    switch (key) {
      case "c1":
      case "c2":
      case "assignMarks":
      case "recordMarks":
        return isNaN(value) || value < 0 || value > 10 
          ? "Must be 0-10" : "";
      case "attendance":
      case "c2Lab":
        return !/^\d{1,3}%$/.test(value) ? "Invalid percentage" : "";
      case "c1Date":
      case "c2Date":
        return !/^\d{4}-\d{2}-\d{2}$/.test(value) ? "Invalid date" : "";
      case "usn":
        return !/^[a-zA-Z0-9]{10}$/.test(value) ? "Invalid USN" : "";
      default:
        return "";
    }
  };

  const handleSave = () => {
    if (Object.values(errors).some(Boolean)) {
      alert("Fix errors before saving");
      return;
    }

    const payload = students.map(student => ({
      ...student,
      c1: student.c1 === "N/A" ? null : student.c1,
      c2: student.c2 === "N/A" ? null : student.c2,
      assignMarks: student.assignMarks === "N/A" ? null : student.assignMarks,
      recordMarks: student.recordMarks === "N/A" ? null : student.recordMarks,
      totalMarks: student.totalMarks === "N/A" ? null : student.totalMarks,
    }));

    axios.put("http://localhost:5000/api/editingstudents/editingstudents", payload)
      .then(() => {
        setIsEditing(false);
        setShowImportSave(false);
        alert("Data saved!");
        fetchStudents();
      })
      .catch(error => {
        console.error("Save error:", error);
        alert("Error saving data");
      });
  };

  const handleEditChange = (slNo, key, value) => {
    const error = validateField(key, value);
    setErrors(prev => ({ ...prev, [`${slNo}-${key}`]: error }));

    if (!error) {
      setStudents(prev => prev.map(student => 
        student.slNo === slNo ? { ...student, [key]: value } : student
      ));
    }
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [csvHeaders.map(header => header.label)],
      body: students.map(student => csvHeaders.map(header => student[header.key])),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 73, 94] }
    });
    doc.save("student_data.pdf");
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter === "" || student.department === departmentFilter) &&
    (yearFilter === "" || student.year === yearFilter) &&
    (branchFilter === "" || student.branch === branchFilter)
  );

  return (
    <div className="bg-[#34495E] p-4 mt-5 text-white">
      <h2 className="text-xl mb-4">Student Internal Assessment</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 p-2 rounded flex-grow"
        />
        <select
          className="bg-gray-800 p-2 rounded"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {[...new Set(students.map(s => s.department))].map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          className="bg-gray-800 p-2 rounded"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">All Years</option>
          {[...new Set(students.map(s => s.year))].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select
          className="bg-gray-800 p-2 rounded"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">All Branches</option>
          {[...new Set(students.map(s => s.branch))].map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <label className="bg-gray-800 p-2 rounded cursor-pointer">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            className="hidden"
          />
        </label>
        <CSVLink
          data={students}
          headers={csvHeaders}
          filename="students.csv"
          className="bg-green-500 p-2 rounded"
        >
          Export CSV
        </CSVLink>
        <button onClick={handlePDFExport} className="bg-red-500 p-2 rounded">
          Export PDF
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 p-2 rounded"
        >
          {isEditing ? "Save Changes" : "Edit Mode"}
        </button>
        {(isEditing || showImportSave) && (
          <button
            onClick={() => {
              setStudents(originalStudents);
              setIsEditing(false);
              setShowImportSave(false);
            }}
            className="bg-gray-500 p-2 rounded"
          >
            Discard Changes
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              {csvHeaders.map(header => (
                <th key={header.key} className="p-2 border">{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.slNo} className="bg-gray-800 hover:bg-gray-700">
                {csvHeaders.map(header => (
                  <td key={header.key} className="p-2 border">
                    {isEditing || showImportSave ? (
                      <div className="relative">
                        <input
                          value={student[header.key]}
                          onChange={(e) => handleEditChange(student.slNo, header.key, e.target.value)}
                          className={`bg-gray-700 p-1 rounded w-full ${
                            errors[`${student.slNo}-${header.key}`] ? "border-2 border-red-500" : ""
                          }`}
                        />
                        {errors[`${student.slNo}-${header.key}`] && (
                          <div className="absolute text-red-500 text-sm">
                            {errors[`${student.slNo}-${header.key}`]}
                          </div>
                        )}
                      </div>
                    ) : (
                      student[header.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditingStudentData;