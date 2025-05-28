import { create } from "zustand";
import axios from "axios";

// Use relative path for API endpoint to work in both development and production
const API_URL = "/api/students";

const useStudentStore = create((set) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ students: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching students:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch students",
        loading: false
      });
    }
  },
}));

export default useStudentStore;
