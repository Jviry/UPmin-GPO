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

// --- PROGRAM API ---
export const getPrograms = async () => {
  try {
    const response = await apiClient.get('/programs');
    // Map response shape: { message, programs }[span_8](start_span)[span_8](end_span)
    return response.data.programs; 
  } catch (error) {
    throw new Error(GENERIC_ERROR_MSG);
  }
};

// --- FACULTY API ---
export const getFaculty = async (position?: string, page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
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