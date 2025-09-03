import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesAPI = {
  getAllNotes: async () => {
    const response = await api.get('/voice-notes');
    return response.data;
  },

  createNote: async (formData) => {
    const response = await api.post('/voice-notes', formData);
    return response.data;
  },

  updateNote: async (id, data) => {
    const response = await api.put(`/voice-notes/${id}`, data);
    return response.data;
  },
  generateSummary: async (id) => {
    const response = await api.post(`/voice-notes/${id}/summary`);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/voice-notes/${id}`);
    return response.data;
  },
};

export default api;