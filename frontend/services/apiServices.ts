import apiClient from '../lib/apiClient';

const GENERIC_ERROR_MSG = "Something went wrong on our end. Please try again later."; // Handle 500 with generic fallback[span_3](start_span)[span_3](end_span)

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