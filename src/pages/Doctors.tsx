// Doctors.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Edit, ArrowLeft, Stethoscope, Activity } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { authService } from '../services/authService';
import { doctorService, type Doctor } from '../services/doctorService';
import { mascaraCelular, mascaraCnpj } from "../utils/mascaras";

function getInitials(name?: string) {
    if (!name) return '--';

    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function removerMascaraCelular(telefone: string): string {
    return telefone.replace(/\D/g, '');
}

function removerMascaraCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
}

const Doctors: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    // Médico tem campos diferentes do paciente: crm, specialty, clinic_cnpj
    // clinic_cnpj só é necessário na criação — o backend precisa dele para
    // encontrar a clínica e vincular o médico. Na edição ele não é enviado.
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        crm: '',
        specialty: '',
        senha: '',
        clinic_cnpj: '',
        telefone: '',
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            const clinicId = authService.getClinicId();

            if (!clinicId || clinicId <= 0) {
                toast.error('Clínica não identificada');
                setLoading(false);
                return;
            }

            try {
                const data = await doctorService.getDoctorsByClinic(clinicId);
                setDoctors(data);
            } catch (error) {
                toast.error('Erro ao carregar médicos: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleAdd = () => {
        setEditingDoctor(null);
        // Pré-preenche o CNPJ se o authService tiver esse dado armazenado,
        // evitando que o usuário precise digitar a cada cadastro
        setFormData({
            nome: '',
            email: '',
            crm: '',
            specialty: '',
            senha: '',
            clinic_cnpj: authService.getClinicCnpj?.() ?? '',
            telefone: '',
        });
        setModalOpen(true);
    };

    const handleEdit = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            nome: doctor.nome,
            email: doctor.email,
            crm: doctor.crm,
            specialty: doctor.specialty,
            senha: '',
            clinic_cnpj: '', // não é usado na edição
            telefone: '',
        });
        setModalOpen(true);
    };

    const handleDelete = async (doctor_id: number) => {
        try {
            await doctorService.deleteDoctor(doctor_id);
            // O backend retorna 204 (sem corpo), então apenas atualizamos o estado local
            setDoctors(doctors.filter(d => d.doctor_id !== doctor_id));
            toast.success('Médico deletado com sucesso');
        } catch (error) {
            toast.error('Erro ao deletar médico');
            console.error(error);
        } finally {
            setConfirmDeleteId(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingDoctor) {
                // PUT — o backend espera { doctor, email, crm, specialty, password? }
                // Note que o campo de nome se chama "doctor" no backend (não "nome")
                const updated = await doctorService.updateDoctor(editingDoctor.doctor_id, {
                    doctor: formData.nome,
                    email: formData.email,
                    crm: formData.crm,
                    specialty: formData.specialty,
                    ...(formData.senha ? { password: formData.senha } : {}),
                });

                // Substituímos o médico na lista pelo objeto retornado pelo backend
                setDoctors(doctors.map(d =>
                    d.doctor_id === editingDoctor.doctor_id ? updated : d
                ));
                toast.success('Médico atualizado com sucesso');
            } else {
                // POST — também usa "doctor" para o nome, e exige clinic_cnpj
                const created = await doctorService.createDoctor({
                    doctor: formData.nome,
                    email: formData.email,
                    crm: formData.crm,
                    specialty: formData.specialty,
                    password: formData.senha,
                    clinic_cnpj: removerMascaraCnpj(formData.clinic_cnpj),
                    telefone: removerMascaraCelular(formData.telefone),
                });
                setDoctors([...doctors, created]);
                toast.success('Médico adicionado com sucesso');
            }
            setModalOpen(false);
        } catch (error) {
            // O serviço já extrai a mensagem de erro do backend (ex: email duplicado)
            toast.error(error instanceof Error ? error.message : 'Erro ao salvar médico');
            console.error(error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Aplicar máscaras
        if (name === 'clinic_cnpj') {
            finalValue = mascaraCnpj(value);
        } else if (name === 'telefone') {
            finalValue = mascaraCelular(value);
        }

        setFormData({ ...formData, [name]: finalValue });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#dbeafe] border-t-[#1D4ED8] rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Carregando médicos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] p-8">
            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="flex items-end justify-between mb-8 gap-4">
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-md font-semibold text-gray-400 uppercase tracking-widest hover:text-[#1D4ED8] transition-colors mb-3"
                        >
                            <ArrowLeft size={13} />
                            Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Médi<span className="text-[#1D4ED8]">cos</span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Gerencie o cadastro de médicos da clínica</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus size={16} />
                        Adicionar Médico
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-4 mb-7">
                    {[
                        { icon: <Stethoscope size={18} />, value: doctors.length, label: 'Total de Médicos' },
                        { icon: <Activity size={18} />, value: 'Ativa', label: 'Status da Clínica' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1D4ED8] rounded-t-xl" />
                            <div className="text-[#1D4ED8] mb-2">{stat.icon}</div>
                            <div className="text-4xl font-bold text-[#1D4ED8] font-mono tracking-tight">{stat.value}</div>
                            <div className="text-md text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* TABLE — médicos têm CRM e especialidade no lugar do telefone */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#eff6ff] border-b border-blue-100">
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Médico</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Email</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">CRM</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Especialidade</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-300">
                                            <Stethoscope size={44} strokeWidth={1.2} />
                                            <p className="text-sm font-medium text-gray-400">Nenhum médico cadastrado ainda</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                doctors.map((doctor, idx) => (
                                    <tr
                                        key={doctor.doctor_id}
                                        className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors ${idx === doctors.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3b82f6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                                                    {getInitials(doctor.nome)}
                                                </div>
                                                <span className="font-semibold text-sm text-gray-800">{doctor.nome}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{doctor.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center bg-gray-50 border border-gray-100 text-gray-500 text-xs font-mono font-medium px-3 py-1.5 rounded-full">
                                                {doctor.crm}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{doctor.specialty}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(doctor)}
                                                    title="Editar"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#eff6ff] border border-blue-100 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white hover:border-[#1D4ED8] transition-all hover:scale-105"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(doctor.doctor_id)}
                                                    title="Deletar"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all hover:scale-105"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FORM MODAL */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
                >
                    <div className="bg-white rounded-2xl p-9 w-full max-w-md shadow-2xl animate-[slideUp_.25s_cubic-bezier(.16,1,.3,1)]">
                        <div className="flex items-center gap-4 mb-7">
                            <div className="w-11 h-11 bg-[#eff6ff] rounded-xl flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
                                {editingDoctor ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                                    {editingDoctor ? 'Editar Médico' : 'Adicionar Médico'}
                                </h2>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    {editingDoctor ? 'Atualize os dados do médico' : 'Preencha os dados do novo médico'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                { label: 'Nome Completo', name: 'nome', type: 'text', placeholder: 'Dr. João Silva' },
                                { label: 'Email', name: 'email', type: 'email', placeholder: 'medico@clinica.com' },
                                { label: 'CRM', name: 'crm', type: 'text', placeholder: 'CRM/SP 123456' },
                                { label: 'Especialidade', name: 'specialty', type: 'text', placeholder: 'Ex: Cardiologia' },
                                { label: 'Telefone', name: 'telefone', type: 'text', placeholder: '(11) 99999-9999', maxLength: 15 },
                                { label: 'Senha', name: 'senha', type: 'password', placeholder: '••••••••' },
                                // CNPJ só aparece no formulário de criação — na edição não é necessário
                                ...(!editingDoctor ? [{
                                    label: 'CNPJ da Clínica',
                                    name: 'clinic_cnpj',
                                    type: 'text',
                                    placeholder: '00.000.000/0001-00',
                                    maxLength: 18,
                                }] : []),
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name as keyof typeof formData]}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder}
                                        maxLength={field.maxLength}
                                        required
                                        className="w-full border-[1.5px] border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 bg-[#fafafa] placeholder-gray-300 outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10 focus:bg-white transition-all"
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end gap-2.5 pt-5 mt-5 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2.5 border-[1.5px] bg-red-100 border-red-200 rounded-lg text-sm font-medium text-red-700 hover:border-red-800 hover:text-[#FAFAFA] hover:bg-red-700 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-200 transition-all"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CONFIRM DELETE MODAL */}
            {confirmDeleteId !== null && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                    onClick={(e) => { if (e.target === e.currentTarget) setConfirmDeleteId(null); }}
                >
                    <div className="bg-white rounded-2xl p-9 w-full max-w-sm shadow-2xl text-center">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Deletar Médico</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Tem certeza que deseja deletar este médico? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-2.5 mt-6">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 px-4 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                                Sim, deletar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                        background: '#111827',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: '10px',
                        padding: '12px 18px',
                    },
                    success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />
        </div>
    );
};

export default Doctors;