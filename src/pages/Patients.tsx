import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Edit } from "lucide-react";
import { mascaraCelular } from '../utils/mascaras';
import toast, { Toaster } from 'react-hot-toast';
import { authService } from '../services/authService';
import { patientService, type Patient } from '../services/patientService';

const Patients: React.FC = () => {
  console.log('Patients page loaded, authenticated:', authService.isAuthenticated(), 'token:', authService.getToken());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
    setFormData({ nome: '', email: '', telefone: '', senha: '' }); // ← adicionar senha
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
    if (window.confirm('Tem certeza que deseja deletar este paciente?')) {
      try {
        await patientService.deletePatient(id);
        setPatients(patients.filter(p => p.id !== id));
        toast.success('Paciente deletado com sucesso');
      } catch (error) {
        toast.error('Erro ao deletar paciente');
        console.error(error);
      }
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

        // O backend retorna { message, patient } — pegue o patient
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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link
          to="/"
          className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
        >
          Voltar ao Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 flex items-center"
      >
        <Plus className="mr-2" /> Adicionar Paciente
      </button>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nome</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Telefone</th>
            <th className="border border-gray-300 px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td className="border border-gray-300 px-4 py-2">{patient.nome}</td>
              <td className="border border-gray-300 px-4 py-2">{patient.email}</td>
              <td className="border border-gray-300 px-4 py-2"> {mascaraCelular(patient.telefone)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(patient)}
                  className="text-blue-500 mr-2"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="text-red-500"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl mb-4">{editingPatient ? 'Editar Paciente' : 'Adicionar Paciente'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  maxLength={15}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mr-2 px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Patients;

