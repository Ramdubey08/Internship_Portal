import api from './api';

// Get all internships with optional filters
export const listInternships = async (params = {}) => {
  try {
    const response = await api.get('/internships/', { params });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch internships' };
  }
};

// Get single internship by ID
export const retrieveInternship = async (id) => {
  try {
    const response = await api.get(`/internships/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch internship' };
  }
};

// Create new internship (company only)
export const createInternship = async (data) => {
  try {
    const response = await api.post('/internships/', data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to create internship' };
  }
};

// Update internship (company only)
export const updateInternship = async (id, data) => {
  try {
    const response = await api.put(`/internships/${id}/`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to update internship' };
  }
};

// Partial update internship
export const patchInternship = async (id, data) => {
  try {
    const response = await api.patch(`/internships/${id}/`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to update internship' };
  }
};

// Delete internship (company only)
export const deleteInternship = async (id) => {
  try {
    await api.delete(`/internships/${id}/`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to delete internship' };
  }
};

// Search internships
export const searchInternships = async (query) => {
  try {
    const response = await api.get('/internships/', { 
      params: { 
        q: query.search,
        location: query.location,
        skills: query.skills,
        remote: query.remote,
        ordering: query.ordering
      } 
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to search internships' };
  }
};

// Apply to internship (student only)
export const applyToInternship = async (internshipId, coverLetter, cvFile = null) => {
  try {
    const formData = new FormData();
    formData.append('internship_id', internshipId);
    formData.append('cover_letter', coverLetter);
    if (cvFile) {
      formData.append('cv_copy', cvFile);
    }

    const response = await api.post('/applications/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Failed to apply' 
    };
  }
};

// Get my posted internships (company only)
export const getMyInternships = async () => {
  try {
    const response = await api.get('/internships/', { params: { my_internships: true } });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch internships' };
  }
};

export default {
  listInternships,
  retrieveInternship,
  createInternship,
  updateInternship,
  patchInternship,
  deleteInternship,
  searchInternships,
  applyToInternship,
  getMyInternships
};