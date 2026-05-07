import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Edit, ArrowLeft, Users, Activity } from "lucide-react";
import { mascaraCelular } from '../utils/mascaras';
import toast, { Toaster } from 'react-hot-toast';
import { authService } from '../services/authService';
import { patientService, type Patient } from '../services/patientService';

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const Patients: React.FC = () => {
  console.log('Patients page loaded, authenticated:', authService.isAuthenticated(), 'token:', authService.getToken());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      const clinicId = authService.getClinicId();
      const userId = authService.getUserId();
      console.log('Clinic ID from storage:', clinicId);
      console.log('User ID from storage:', userId);

      if (clinicId && clinicId > 0) {
        setClinicId(clinicId);
        try {
          console.log('Fetching patients for clinic:', clinicId);
          const patientsData = await patientService.getPatientsByClinic(clinicId);
          console.log('Patients data received:', patientsData);
          setPatients(patientsData || []);
        } catch (error) {
          console.error('Error fetching patients by clinic:', error);
          toast.error('Erro ao carregar pacientes: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
          setLoading(false);
        }
        return;
      }

      if (userId && userId > 0) {
        try {
          console.log('Fetching patients for user:', userId);
          const patientsData = await patientService.getPatientsByUser(userId);
          console.log('Patients data received:', patientsData);
          setPatients(patientsData || []);
        } catch (error) {
          console.error('Error fetching patients by user:', error);
          toast.error('Erro ao carregar pacientes: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
          setLoading(false);
        }
        return;
      }

      console.error('Nenhum clinic_id ou user_id disponível para buscar pacientes');
      toast.error('Dados de usuário inválidos');
      setLoading(false);
    };

    fetchPatients();
  }, []);

  const handleAdd = () => {
    setEditingPatient(null);
    setFormData({ nome: '', email: '', telefone: '', senha: '' });
    setModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      nome: patient.nome,
      email: patient.email,
      telefone: mascaraCelular(patient.telefone),
      senha: '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await patientService.deletePatient(id);
      setPatients(patients.filter(p => p.id !== id));
      toast.success('Paciente deletado com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar paciente');
      console.error(error);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicId) return;

    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient.id, {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone.replace(/\D/g, ''),
          password: formData.senha,
        });
        setPatients(patients.map(p => p.id === editingPatient.id ? { ...p, ...formData } : p));
        toast.success('Paciente atualizado com sucesso');
      } else {
        const userId = authService.getUserId();
        if (!userId) {
          toast.error('User ID não encontrado');
          return;
        }
        const response = await patientService.createPatient({
          ...formData,
          telefone: formData.telefone.replace(/\D/g, ''),
          password: formData.senha,
          user_id: userId,
        });

        const newPatient = (response as any).patient ?? response;
        setPatients([...patients, newPatient]);
        toast.success('Paciente adicionado com sucesso');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar paciente');
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData({ ...formData, [name]: mascaraCelular(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#dbeafe] border-t-[#1D4ED8] rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Carregando pacientes...</p>
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
              Paci<span className="text-[#1D4ED8]">entes</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Gerencie o cadastro de pacientes da clínica</p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={16} />
            Adicionar Paciente
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-7">
          {[
            { icon: <Users size={18} />, value: patients.length, label: 'Total de Pacientes' },
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

        {/* TABLE */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#eff6ff] border-b border-blue-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Paciente</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Email</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Telefone</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-300">
                      <Users size={44} strokeWidth={1.2} />
                      <p className="text-sm font-medium text-gray-400">Nenhum paciente cadastrado ainda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className={`border-b border-gray-50 hover:bg-blue-50/40 transition-colors ${idx === patients.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#3b82f6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                          {getInitials(patient.nome)}
                        </div>
                        <span className="font-semibold text-sm text-gray-800">{patient.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{patient.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center bg-gray-50 border border-gray-100 text-gray-500 text-xs font-mono font-medium px-3 py-1.5 rounded-full">
                        {mascaraCelular(patient.telefone)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(patient)}
                          title="Editar"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#eff6ff] border border-blue-100 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white hover:border-[#1D4ED8] transition-all hover:scale-105"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(patient.id)}
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
                {editingPatient
                  ? <Edit size={20} />
                  : <Plus size={20} />
                }
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  {editingPatient ? 'Editar Paciente' : 'Adicionar Paciente'}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {editingPatient ? 'Atualize os dados do paciente' : 'Preencha os dados do novo paciente'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Nome Completo', name: 'nome', type: 'text', placeholder: 'Ex: Maria Silva' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'email@exemplo.com' },
                { label: 'Telefone', name: 'telefone', type: 'text', placeholder: '(00) 00000-0000', maxLength: 15 },
                { label: 'Senha', name: 'senha', type: 'password', placeholder: '••••••••' },
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
            <h2 className="text-lg font-bold text-gray-900 mb-2">Deletar Paciente</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tem certeza que deseja deletar este paciente? Esta ação não pode ser desfeita.
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
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
};

export default Patients;