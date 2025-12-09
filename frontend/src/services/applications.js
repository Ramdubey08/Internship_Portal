import api from './api';

// Get all applications for current user
export const listApplications = async () => {
  try {
    const response = await api.get('/applications/');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch applications' };
  }
};

// Get single application by ID
export const retrieveApplication = async (id) => {
  try {
    const response = await api.get(`/applications/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch application' };
  }
};

// Get student's applications
export const getMyApplications = async () => {
  try {
    const response = await api.get('/applications/my_applications/');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch applications' };
  }
};

// Get applicants for a specific internship (company only)
export const getInternshipApplicants = async (internshipId) => {
  try {
    const response = await api.get(`/applications/${internshipId}/internship_applications/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to fetch applicants' };
  }
};

// Update application status (company only)
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await api.patch(`/applications/${applicationId}/`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to update status' };
  }
};

// Create application (apply to internship)
export const createApplication = async (data) => {
  try {
    const formData = new FormData();
    formData.append('internship_id', data.internship_id);
    formData.append('cover_letter', data.cover_letter);
    if (data.cv_copy) {
      formData.append('cv_copy', data.cv_copy);
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
      error: error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Failed to submit application' 
    };
  }
};

// Bulk update applications (for company to process multiple applications)
export const bulkUpdateApplications = async (applicationIds, status) => {
  try {
    const promises = applicationIds.map(id => updateApplicationStatus(id, status));
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update applications' };
  }
};

// Get application statistics
export const getApplicationStats = async () => {
  try {
    const response = await api.get('/applications/');
    const applications = response.data.results || response.data;
    
    const stats = {
      total: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      reviewing: applications.filter(a => a.status === 'reviewing').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      accepted: applications.filter(a => a.status === 'accepted').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };
    
    return { success: true, data: stats };
  } catch (error) {
    return { success: false, error: 'Failed to fetch stats' };
  }
};

export default {
  listApplications,
  retrieveApplication,
  getMyApplications,
  getInternshipApplicants,
  updateApplicationStatus,
  createApplication,
  bulkUpdateApplications,
  getApplicationStats
};