import React, { useState } from "react";
import TeacherProfileDisplay from "../components/settings/TeacherProfileDisplay";
import TeacherProfileEdit from "../components/settings/TeacherProfileEdit";
import ChangePassword from "../components/settings/ChangePassword";
import Header from "../components/common/Header";
const TeacherProfilePage = () => {
  // Initial profile data
  const teacher = {
    name: "John Doe",
    department: "Mathematics",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  };

  // State to manage if we are in edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(teacher);

  // Handle saving the profile after editing
  const handleSaveProfile = () => {
    // Example API call to update the teacher profile
    fetch("/api/update-profile", {
      method: "POST",
      body: JSON.stringify(editedProfile),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile updated:", data);
        setIsEditing(false); // Exit edit mode
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#34495E]"> 
    <Header/>
    {/* Background color: Slate Gray */}
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 text-[#FFFFFF]"> {/* Text color: White */}
      <div className="mt-6 p-6 bg-[#2C3E50] rounded-lg shadow-lg">
        {/* Conditionally render based on whether we are in edit mode */}
        {isEditing ? (
          <TeacherProfileEdit
            teacher={editedProfile}
            setTeacher={setEditedProfile}
            onSave={handleSaveProfile}
          />
        ) : (
          <TeacherProfileDisplay teacher={teacher} onEdit={() => setIsEditing(true)} />
        )}
</div>
        <div className="mt-6 p-6 bg-[#2C3E50] rounded-lg shadow-lg"> {/* Background color: Dark Blue */}
        {/* Change Password section */}
          <ChangePassword />
        </div>
      </main>
    </div>
  );
};

export default TeacherProfilePage;
