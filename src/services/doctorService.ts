// doctorService.ts

import { apiFetch } from "./api";

const API_URL = import.meta.env.VITE_API_URL;

// Interface que reflete o retorno do JOIN feito em getDoctorById no backend
// (campos de Doctor + campos de User mesclados em um único objeto)
export interface Doctor {
    doctor_id: number;
    user_id: number;
    clinic_id: number;
    crm: string;
    specialty: string;
    nome: string;
    email: string;
    telefone?: string;
}

function normalizeDoctor(data: any): Doctor {
    return {
        doctor_id: data.doctor_id ?? data.id,
        user_id: data.user_id,
        clinic_id: data.clinic_id,
        crm: data.crm,
        specialty: data.specialty,
        nome: data.nome ?? data.doctor ?? '',
        email: data.email ?? '',
        telefone: data.telefone ?? '',
    };
}

// Dados necessários para criar um médico.
// Note que o nome vai no campo "doctor" — é como o backend desestrutura.
export interface CreateDoctorData {
    doctor: string;      // nome do médico
    email: string;
    telefone: string;
    password: string;
    clinic_cnpj: string; // o backend busca a clínica pelo CNPJ
    specialty: string;
    crm: string;
}

export interface UpdateDoctorData {
    doctor: string;
    email: string;
    crm: string;
    specialty: string;
    password?: string;
}

export const doctorService = {
    // GET /doctors/:doctor_id
    async getDoctorById(doctor_id: number): Promise<Doctor> {
        const response = await apiFetch(`${API_URL}/doctors/${doctor_id}`);

        if (!response.ok) throw new Error(`Erro ao buscar médico: ${response.status}`);

        const data = await response.json();
        return normalizeDoctor(data);
    },

    async getDoctorsByClinic(clinic_id: number): Promise<Doctor[]> {
        const response = await apiFetch(`${API_URL}/doctors/clinic/${clinic_id}`);
        if (!response.ok) throw new Error(`Erro ao buscar médicos: ${response.status}`);
        const data = await response.json();
        const doctors = Array.isArray(data) ? data : data.doctors ?? [];
        return doctors.map(normalizeDoctor);
    },

    // POST /doctors
    // O backend retorna o objeto do médico recém-criado com status 201
    async createDoctor(data: CreateDoctorData): Promise<Doctor> {
        const response = await apiFetch(`${API_URL}/doctors`, {
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const message = errorData?.message ?? "Erro ao criar médico";
            throw new Error(message);
        }

        const createdDoctor = await response.json();

        return normalizeDoctor(
            {
                ...createdDoctor,
                nome: data.doctor,
                email: data.email,
                telefone: data.telefone,
            }
        );
    },

    // PUT /doctors/:doctor_id
    async updateDoctor(doctor_id: number, data: UpdateDoctorData): Promise<Doctor> {
        const response = await apiFetch(`${API_URL}/doctors/${doctor_id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Erro ao atualizar médico: ${response.status}`);

        const updatedDoctor = await response.json();
        return normalizeDoctor(updatedDoctor);
    },

    // DELETE /doctors/:doctor_id
    // O backend retorna 204 No Content (sem corpo), então não chamamos .json()
    async deleteDoctor(doctor_id: number): Promise<void> {
        const response = await apiFetch(`${API_URL}/doctors/${doctor_id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error(`Erro ao deletar médico: ${response.status}`);

        // 204 não tem corpo de resposta — tentar .json() aqui causaria erro
    },
};