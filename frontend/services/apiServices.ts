import apiClient from '../lib/apiClient';

const GENERIC_ERROR_MSG = "Something went wrong on our end. Please try again later."; // Handle 500 with generic fallback[span_3](start_span)[span_3](end_span)

// --- AUTH API ---
export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    // Map response shape: { message, token }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

// --- ANNOUNCEMENT API ---
export const getAnnouncements = async () => {
  try {
    const response = await apiClient.get('/announcements');
    // Map response shape: { message, announcements }[span_4](start_span)[span_4](end_span)
    return response.data.announcements;
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

export const getAnnouncementById = async (id: string) => {
  try {
    const response = await apiClient.get(`/announcements/${id}`);
    // Map response shape: { message, announcement }[span_5](start_span)[span_5](end_span)
    return response.data.announcement;
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

// --- OFFICE API ---
export const getOfficeInfo = async () => {
  try {
    // Always fetches office ID 1[span_6](start_span)[span_6](end_span)
    const response = await apiClient.get('/office');
    // Map response shape: { message, office }[span_7](start_span)[span_7](end_span)
    return response.data.office;
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

export const updateGoogleFormUrl = async (url: string) => {
  try {
    const response = await apiClient.patch('/office/google-url', { application_google_url: url });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

// --- PROGRAM API ---
export const getPrograms = async () => {
  try {
    const response = await apiClient.get('/programs');
    return response.data.programs;
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

export const createProgram = async (data: {
  type: string;
  name: string;
  description: string;
  history: string;
  photoFile?: File | null;
}) => {
  try {
    const form = new FormData();
    form.append('type', data.type);
    form.append('name', data.name);
    form.append('description', data.description);
    form.append('history', data.history);
    if (data.photoFile) form.append('photo', data.photoFile);

    const response = await apiClient.post('/programs', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.program;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const updateProgram = async (
  id: number,
  data: {
    type: string;
    name: string;
    description: string;
    history: string;
    existingPhoto?: string;
    photoFile?: File | null;
  }
) => {
  try {
    const form = new FormData();
    form.append('type', data.type);
    form.append('name', data.name);
    form.append('description', data.description);
    form.append('history', data.history);
    if (data.photoFile) {
      form.append('photo', data.photoFile);
    } else if (data.existingPhoto) {
      form.append('photo', data.existingPhoto);
    }

    const response = await apiClient.put(`/programs/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.program;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const deleteProgram = async (id: number) => {
  try {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data.deletedProgram;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const updateProgramApplication = async (
  programId: number,
  data: {
    qualifications: string;
    application_instructions: string;
    application_requirements: string;
    application_url?: File | null;
    recommendation_url?: File | null;
    fees_url?: File | null;
  }
) => {
  try {
    const form = new FormData();
    form.append('qualifications', data.qualifications);
    form.append('application_instructions', data.application_instructions);
    form.append('application_requirements', data.application_requirements);
    if (data.application_url) form.append('application_url', data.application_url);
    if (data.recommendation_url) form.append('recommendation_url', data.recommendation_url);
    if (data.fees_url) form.append('fees_url', data.fees_url);

    const response = await apiClient.put(`/programs/${programId}/application`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};
// --- FACULTY API ---
export const getFaculty = async (position?: string, page = 1, limit?: number) => {
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (limit != null) params.set('limit', String(limit));
    else params.set('all', 'true');
    if (position) params.set('position', position);
    const response = await apiClient.get(`/faculty?${params}`);
    return {
      faculties: response.data.faculties,
      total: response.data.total as number,
      totalPages: response.data.totalPages as number,
      page: response.data.page as number,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const createFaculty = async (facultyData: {
  name: string;
  email: string;
  position: string;
  credentials: string[];
  photoFile?: File | null;
}) => {
  try {
    const form = new FormData();
    form.append('name', facultyData.name);
    form.append('email', facultyData.email);
    form.append('position', facultyData.position);
    form.append('credentials', JSON.stringify(facultyData.credentials));
    if (facultyData.photoFile) form.append('photo', facultyData.photoFile);

    const response = await apiClient.post('/faculty', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.faculty;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const updateFaculty = async (
  id: number,
  facultyData: {
    name?: string;
    email?: string;
    position?: string;
    credentials?: string[];
    existingPhoto?: string;
    photoFile?: File | null;
  }
) => {
  try {
    const form = new FormData();
    if (facultyData.name !== undefined) form.append('name', facultyData.name);
    if (facultyData.email !== undefined) form.append('email', facultyData.email);
    if (facultyData.position !== undefined) form.append('position', facultyData.position);
    if (facultyData.credentials !== undefined) form.append('credentials', JSON.stringify(facultyData.credentials));
    if (facultyData.photoFile) {
      form.append('photo', facultyData.photoFile);
    } else if (facultyData.existingPhoto) {
      form.append('photo', facultyData.existingPhoto);
    }

    const response = await apiClient.put(`/faculty/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.faculty;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const deleteFaculty = async (id: number) => {
  try {
    const response = await apiClient.delete(`/faculty/${id}`);
    // Map response shape: { message, faculty }
    return response.data.faculty;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const syncProgramFaculty = async (programId: number, facultyIds: number[]) => {
  try {
    const response = await apiClient.put(`/programs/${programId}/faculty`, { faculty_ids: facultyIds });
    // Map response shape: { message, faculties }
    return response.data.faculties;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const getTestimonies = async () => {
  try {
    const response = await apiClient.get('/testimonies');
    return response.data.testimonies; // Ensure your backend returns { testimonies: [...] }
  } catch (error) {
    throw new Error("Failed to load testimonies.");
  }
};

export const getCoordinators = async () => {
  try {
    const response = await apiClient.get('/faculty?position=Program Coordinator');
    return response.data.faculties;
  } catch (error) {
    throw new Error("Failed to load coordinators.");
  }
};

// --- SELF-SERVICE PROFILE API ---
export const updateOwnProfile = async (data: { name?: string; email?: string }) => {
  try {
    const response = await apiClient.put('/auth/profile', data);
    return response.data.admin;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const changeOwnPassword = async (currentPassword: string, newPassword: string) => {
  try {
    await apiClient.put('/auth/password', { currentPassword, newPassword });
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

// --- ADMIN MANAGEMENT API (superadmin only) ---
export const getAdmins = async () => {
  try {
    const response = await apiClient.get('/admins');
    return response.data.admins as Array<{ admin_id: number; name: string; email: string; role: string }>;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const createAdmin = async (data: { name: string; email: string; password: string; role: string }) => {
  try {
    const response = await apiClient.post('/admins', data);
    return response.data.admin;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const verifyPassword = async (password: string) => {
  try {
    await apiClient.post('/auth/verify-password', { password });
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const updateAdmin = async (
  id: number,
  data: { name?: string; email?: string; role?: string; newPassword?: string }
) => {
  try {
    const response = await apiClient.put(`/admins/${id}`, data);
    return response.data.admin;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const deleteAdmin = async (id: number) => {
  try {
    const response = await apiClient.delete(`/admins/${id}`);
    return response.data.deletedAdmin;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};


// --- SCHOLARSHIP API ---
export const getScholarships = async () => {
  try {
    const response = await apiClient.get('/scholarships');
    return response.data.scholarships;
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

export const getScholarshipById = async (id: string) => {
  try {
    const response = await apiClient.get(`/scholarships/${id}`);
    return response.data.scholarship;
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

// --- STUDY PLAN API ---
export const createStudyPlan = async (programId: number, data: { name: string; years: number }) => {
  try {
    const response = await apiClient.post(`/programs/${programId}/study-plan`, data);
    return response.data.studyPlan;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const deleteStudyPlan = async (programId: number, studyPlanId: number) => {
  try {
    const response = await apiClient.delete(`/programs/${programId}/study-plan/${studyPlanId}`);
    return response.data.deletedStudyPlan;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const syncStudyPlanEntries = async (programId: number, studyPlanId: number, courses: { course_id: number | null; is_elective_slot: boolean; year: number; semester: number }[]) => {
  try {
    const response = await apiClient.post(`/programs/${programId}/study-plan/${studyPlanId}/entries`, { courses });
    return response.data.studyPlanCourses;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

// --- COURSE POOL API ---
export const createCoursePool = async (programId: number, data: { name: string }) => {
  try {
    const response = await apiClient.post(`/programs/${programId}/course-pool`, data);
    return response.data.coursePool;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const deleteCoursePool = async (programId: number, coursePoolId: number) => {
  try {
    const response = await apiClient.delete(`/programs/${programId}/course-pool/${coursePoolId}`);
    return response.data.deletedCoursePool;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};

export const syncCoursePoolEntries = async (programId: number, coursePoolId: number, courseIds: number[]) => {
  try {
    const response = await apiClient.post(`/programs/${programId}/course-pool/${coursePoolId}/entries`, { course_ids: courseIds });
    return response.data.coursePoolEntries;
  } catch (error: any) {
    const message = error.response?.data?.message || GENERIC_ERROR_MSG;
    throw new Error(message);
  }
};
