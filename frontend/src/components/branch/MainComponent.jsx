import React, { useState } from 'react';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Link } from 'react-router-dom';

const colorScheme = {
  primary: '#2C3E50', // Dark Blue
  secondary: '#ECF0F1', // Light Gray
  accent: '#E74C3C', // Coral Red
  text: '#FFFFFF', // White
  background: '#34495E', // Slate Gray
};

const studentDetails = {
    PCM: [
        {
          rollNumber: 1,
          name: 'Alice',
          branch: 'PCM',
          ia1Date: '2024-01-10',
          ia1Marks: 18,
          ia2Date: '2024-02-10',
          ia2Marks: 20,
          ia3Date: '2024-03-10',
          ia3Marks: 22,
          minMarks: 35,
          totalMarks: 60,
        },
        {
          rollNumber: 2,
          name: 'Bob',
          branch: 'PCM',
          ia1Date: '2024-01-15',
          ia1Marks: 15,
          ia2Date: '2024-02-15',
          ia2Marks: 18,
          ia3Date: '2024-03-15',
          ia3Marks: 19,
          minMarks: 35,
          totalMarks: 52,
        },
        {
          rollNumber: 3,
          name: 'Charlie',
          branch: 'PCM',
          ia1Date: '2024-01-20',
          ia1Marks: 19,
          ia2Date: '2024-02-20',
          ia2Marks: 22,
          ia3Date: '2024-03-20',
          ia3Marks: 24,
          minMarks: 35,
          totalMarks: 65,
        },
        {
          rollNumber: 4,
          name: 'David',
          branch: 'PCM',
          ia1Date: '2024-01-25',
          ia1Marks: 20,
          ia2Date: '2024-02-25',
          ia2Marks: 23,
          ia3Date: '2024-03-25',
          ia3Marks: 21,
          minMarks: 35,
          totalMarks: 64,
        },
        {
          rollNumber: 5,
          name: 'Eve',
          branch: 'PCM',
          ia1Date: '2024-01-30',
          ia1Marks: 21,
          ia2Date: '2024-02-30',
          ia2Marks: 19,
          ia3Date: '2024-03-30',
          ia3Marks: 20,
          minMarks: 35,
          totalMarks: 60,
        },
        {
          rollNumber: 6,
          name: 'Fay',
          branch: 'PCM',
          ia1Date: '2024-02-04',
          ia1Marks: 18,
          ia2Date: '2024-03-04',
          ia2Marks: 20,
          ia3Date: '2024-04-04',
          ia3Marks: 21,
          minMarks: 35,
          totalMarks: 59,
        },
        {
          rollNumber: 7,
          name: 'Grace',
          branch: 'PCM',
          ia1Date: '2024-02-08',
          ia1Marks: 19,
          ia2Date: '2024-03-08',
          ia2Marks: 21,
          ia3Date: '2024-04-08',
          ia3Marks: 23,
          minMarks: 35,
          totalMarks: 63,
        },
        {
          rollNumber: 8,
          name: 'Heidi',
          branch: 'PCM',
          ia1Date: '2024-02-12',
          ia1Marks: 22,
          ia2Date: '2024-03-12',
          ia2Marks: 23,
          ia3Date: '2024-04-12',
          ia3Marks: 24,
          minMarks: 35,
          totalMarks: 69,
        },
        {
          rollNumber: 9,
          name: 'Ivan',
          branch: 'PCM',
          ia1Date: '2024-02-16',
          ia1Marks: 20,
          ia2Date: '2024-03-16',
          ia2Marks: 19,
          ia3Date: '2024-04-16',
          ia3Marks: 21,
          minMarks: 35,
          totalMarks: 60,
        },
        {
          rollNumber: 10,
          name: 'Judy',
          branch: 'PCM',
          ia1Date: '2024-02-20',
          ia1Marks: 18,
          ia2Date: '2024-03-20',
          ia2Marks: 21,
          ia3Date: '2024-04-20',
          ia3Marks: 23,
          minMarks: 35,
          totalMarks: 62,
        },
        {
          rollNumber: 11,
          name: 'Karen',
          branch: 'PCM',
          ia1Date: '2024-02-24',
          ia1Marks: 23,
          ia2Date: '2024-03-24',
          ia2Marks: 24,
          ia3Date: '2024-04-24',
          ia3Marks: 25,
          minMarks: 35,
          totalMarks: 72,
        },
        {
          rollNumber: 12,
          name: 'Leo',
          branch: 'PCM',
          ia1Date: '2024-02-28',
          ia1Marks: 20,
          ia2Date: '2024-03-28',
          ia2Marks: 21,
          ia3Date: '2024-04-28',
          ia3Marks: 22,
          minMarks: 35,
          totalMarks: 63,
        },
        {
          rollNumber: 13,
          name: 'Mona',
          branch: 'PCM',
          ia1Date: '2024-03-04',
          ia1Marks: 19,
          ia2Date: '2024-04-04',
          ia2Marks: 23,
          ia3Date: '2024-05-04',
          ia3Marks: 24,
          minMarks: 35,
          totalMarks: 66,
        },
        {
          rollNumber: 14,
          name: 'Nina',
          branch: 'PCM',
          ia1Date: '2024-03-08',
          ia1Marks: 21,
          ia2Date: '2024-04-08',
          ia2Marks: 20,
          ia3Date: '2024-05-08',
          ia3Marks: 22,
          minMarks: 35,
          totalMarks: 63,
        },
        {
          rollNumber: 15,
          name: 'Oscar',
          branch: 'PCM',
          ia1Date: '2024-03-12',
          ia1Marks: 17,
          ia2Date: '2024-04-12',
          ia2Marks: 18,
          ia3Date: '2024-05-12',
          ia3Marks: 19,
          minMarks: 35,
          totalMarks: 54,
        },
        {
          rollNumber: 16,
          name: 'Paul',
          branch: 'PCM',
          ia1Date: '2024-03-16',
          ia1Marks: 22,
          ia2Date: '2024-04-16',
          ia2Marks: 21,
          ia3Date: '2024-05-16',
          ia3Marks: 23,
          minMarks: 35,
          totalMarks: 66,
        },
        {
          rollNumber: 17,
          name: 'Quinn',
          branch: 'PCM',
          ia1Date: '2024-03-20',
          ia1Marks: 18,
          ia2Date: '2024-04-20',
          ia2Marks: 20,
          ia3Date: '2024-05-20',
          ia3Marks: 21,
          minMarks: 35,
          totalMarks: 59,
        },
        {
          rollNumber: 18,
          name: 'Rita',
          branch: 'PCM',
          ia1Date: '2024-03-24',
          ia1Marks: 20,
          ia2Date: '2024-04-24',
          ia2Marks: 22,
          ia3Date: '2024-05-24',
          ia3Marks: 24,
          minMarks: 35,
          totalMarks: 66,
        },
        {
          rollNumber: 19,
          name: 'Sam',
          branch: 'PCM',
          ia1Date: '2024-03-28',
          ia1Marks: 19,
          ia2Date: '2024-04-28',
          ia2Marks: 20,
          ia3Date: '2024-05-28',
          ia3Marks: 22,
          minMarks: 35,
          totalMarks: 61,
        },
        {
          rollNumber: 20,
          name: 'Tina',
          branch: 'PCM',
          ia1Date: '2024-04-02',
          ia1Marks: 21,
          ia2Date: '2024-05-02',
          ia2Marks: 23,
          ia3Date: '2024-06-02',
          ia3Marks: 25,
          minMarks: 35,
          totalMarks: 69,
        },
      ],
    
      // Continue with
    
    
    
  
};

const YearTable = ({ onYearClick }) => {
  const years = [
    { year: 'First Year', students: 50 },
    { year: 'Second Year', students: 60 },
    { year: 'Third Year', students: 70 },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              style={{ backgroundColor: colorScheme.primary, color: colorScheme.text }}
            >
              Year
            </TableCell>
            <TableCell
              align="center"
              style={{ backgroundColor: colorScheme.primary, color: colorScheme.text }}
            >
              Number of Students
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {years.map((year) => (
            <TableRow
              key={year.year}
              onClick={() => onYearClick(year.year)}
              style={{ cursor: 'pointer', backgroundColor: colorScheme.secondary }}
            >
              <TableCell align="center">{year.year}</TableCell>
              <TableCell align="center">{year.students}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const BranchComponent = ({ onBranchSelect }) => {
  const branches = ['PCM', 'PEM', 'PMCs'];

  return (
    <div className="p-4 bg-white">
      <h3 className="text-2xl text-black font-bold">Select a Branch</h3>
      <div className="space-y-4 mt-4">
        {branches.map((branch) => (
          <Button
            key={branch}
            variant="contained"
            onClick={() => onBranchSelect(branch)}
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.text,
            }}
            className="hover:bg-white hover:text-black w-full"
          >
            {branch}
          </Button>
        ))}
      </div>
    </div>
  );
};

const StudentDetailsTable = ({ branch }) => {
  const students = studentDetails[branch] || [];

  return (
    <div className="p-4 bg-white">
      <h3 className="text-2xl font-bold mb-4">Student Details for {branch}</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Roll Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>IA 1 Date</TableCell>
              <TableCell>IA 1 Marks</TableCell>
              <TableCell>IA 2 Date</TableCell>
              <TableCell>IA 2 Marks</TableCell>
              <TableCell>IA 3 Date</TableCell>
              <TableCell>IA 3 Marks</TableCell>
              <TableCell>Min Marks to Pass</TableCell>
              <TableCell>Total Marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.rollNumber}>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.branch}</TableCell>
                <TableCell>{student.ia1Date}</TableCell>
                <TableCell>{student.ia1Marks}</TableCell>
                <TableCell>{student.ia2Date}</TableCell>
                <TableCell>{student.ia2Marks}</TableCell>
                <TableCell>{student.ia3Date}</TableCell>
                <TableCell>{student.ia3Marks}</TableCell>
                <TableCell>{student.minMarks}</TableCell>
                <TableCell>{student.totalMarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const MainComponent = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
  };

  const handleBackButtonClick = () => {
    if (selectedBranch) {
      setSelectedBranch(null);
    } else if (selectedYear) {
      setSelectedYear(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorScheme.background }}>
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button
            variant="contained"
            onClick={handleBackButtonClick}
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.text,
              marginRight: '20px',
            }}
            className="hover:bg-white hover:text-black"
          >
            <ChevronLeftIcon />
            Back
          </Button>
          <h1 className="text-center text-4xl text-black">Student Information</h1>
        </div>
        <div className="mt-6">
          {!selectedYear ? (
            <YearTable onYearClick={handleYearClick} />
          ) : !selectedBranch ? (
            <BranchComponent onBranchSelect={handleBranchSelect} />
          ) : (
            <StudentDetailsTable branch={selectedBranch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
