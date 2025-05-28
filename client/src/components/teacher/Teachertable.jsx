import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const Teachertable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [canEditFilter, setCanEditFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Dr. Aditi Rao", department: "Physics", canEdit: true },
    { id: 2, name: "Mr. Ravi Kumar", department: "Physics", canEdit: false },
    { id: 3, name: "Ms. Priya Sharma", department: "Physics", canEdit: true },
    { id: 4, name: "Dr. Sneha Das", department: "Physics", canEdit: false },
  ]);

  // Handle Grant/Revoke Permissions
  const handleGrantRevoke = (id, action) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === id ? { ...teacher, canEdit: action === "grant" } : teacher
      )
    );
  };

  // Filter the teachers based on the search query and filters
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (departmentFilter === "" || teacher.department === departmentFilter) &&
      (canEditFilter === "" || teacher.canEdit === (canEditFilter === "yes"))
  );

  // Auto-revoke permissions after the end date
  useEffect(() => {
    if (endDate && new Date() > new Date(endDate)) {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) => ({ ...teacher, canEdit: false }))
      );
    }
  }, [endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card className="max-w-4xl mx-auto mt-8 shadow-lg" style={{ backgroundColor: "#34495E", color: "#FFFFFF" }}>
        <CardContent>
          <h1 className="text-xl font-bold mb-4 text-center" style={{ borderColor: "#34495E" }}>
            Teacher Information
          </h1>

          {/* Search Bar and Filters */}
          <div className="mb-4 flex flex-col gap-4">
            <TextField
              label="Search Teachers"
              variant="outlined"
              fullWidth
              style={{ backgroundColor: "#FFFFFF" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="department-filter-label">Department</InputLabel>
              <Select
                labelId="department-filter-label"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="can-edit-filter-label">Can Edit</InputLabel>
              <Select
                labelId="can-edit-filter-label"
                value={canEditFilter}
                onChange={(e) => setCanEditFilter(e.target.value)}
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
            <div className="flex  gap-4">
              <DatePicker className="text-white" label="Start Date" value={startDate} onChange={setStartDate} />
              <DatePicker  className="text-white" label="End Date" value={endDate} onChange={setEndDate} />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table-auto w-full border-collapse" style={{ border: "1px solid #FFFFFF" }}>
              <thead>
                <tr style={{ backgroundColor: "#34495E" }}>
                  <th className="px-4 py-2 text-left" style={{ border: "1px solid #FFFFFF" }}>#</th>
                  <th className="px-4 py-2 text-left" style={{ border: "1px solid #FFFFFF" }}>Name</th>
                  <th className="px-4 py-2 text-left" style={{ border: "1px solid #FFFFFF" }}>Department</th>
                  <th className="px-4 py-2 text-left" style={{ border: "1px solid #FFFFFF" }}>Can Edit</th>
                  <th className="px-4 py-2 text-left" style={{ border: "1px solid #FFFFFF" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher, index) => (
                  <tr key={teacher.id} style={{ backgroundColor: index % 2 === 0 ? "#34495E" : "#2C3E50" }}>
                    <td className="px-4 py-2" style={{ border: "1px solid #FFFFFF" }}>{index + 1}</td>
                    <td className="px-4 py-2" style={{ border: "1px solid #FFFFFF" }}>{teacher.name}</td>
                    <td className="px-4 py-2" style={{ border: "1px solid #FFFFFF" }}>{teacher.department}</td>
                    <td className="px-4 py-2" style={{ border: "1px solid #FFFFFF" }}>
                      {teacher.canEdit ? <span style={{ color: "#2ECC71", fontWeight: "bold" }}>Yes</span> : <span style={{ color: "#E74C3C", fontWeight: "bold" }}>No</span>}
                    </td>
                    <td className="px-4 py-2" style={{ border: "1px solid #FFFFFF" }}>
                      <div className="flex gap-2">
                        <Button variant="contained" style={{ backgroundColor: "#3498DB", color: "#FFFFFF" }} onClick={() => handleGrantRevoke(teacher.id, "grant")}>Grant</Button>
                        <Button variant="contained" style={{ backgroundColor: "#E74C3C", color: "#FFFFFF" }} onClick={() => handleGrantRevoke(teacher.id, "revoke")}>Revoke</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default Teachertable;
