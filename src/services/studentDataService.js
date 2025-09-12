import api from './api';

export const studentDataService = {
  // Get all uploaded student data files with user information
  getAllStudentFiles: async () => {
    const response = await api.get('/admin/get-all-student-files');
    return response.data;
  },

  // Get student data files by form ID
  getStudentDataByForm: async (formId) => {
    const response = await api.get(`/get-student-data/${formId}`);
    return response.data;
  }
};