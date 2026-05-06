import { apiFetch } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

export interface Patient {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  user_id: number;
}

export const patientService = {
  async getPatientsByClinic(clinic_id: number): Promise<Patient[]> {
    if (!clinic_id || clinic_id <= 0) {
      throw new Error('Invalid clinic_id');
    }
    const url = `${API_URL}/patients/clinic/${clinic_id}`;
    console.log('Calling API:', url);
    const response = await apiFetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('API returned:', data);
    return data;
  },

  async getPatientsByUser(user_id: number): Promise<Patient[]> {
    if (!user_id || user_id <= 0) {
      throw new Error('Invalid user_id');
    }
    const url = `${API_URL}/patients/user/${user_id}`;
    console.log('Calling API:', url);
    const response = await apiFetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('API returned:', data);
    return data;
  },

  async createPatient(data: { nome: string; email: string; telefone: string; user_id: number }): Promise<Patient> {
    const response = await apiFetch(`${API_URL}/patients`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create patient");
    return response.json();
  },

  async updatePatient(id: number, data: { nome: string; telefone: string }): Promise<any> {
    const response = await apiFetch(`${API_URL}/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update patient");
    return response.json();
  },

  async deletePatient(id: number): Promise<any> {
    const response = await apiFetch(`${API_URL}/patients/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete patient");
    return response.json();
  },

  async getPatientById(id: number): Promise<Patient> {
    const response = await apiFetch(`${API_URL}/patients/${id}`);
    if (!response.ok) throw new Error("Failed to fetch patient");
    return response.json();
  },
};