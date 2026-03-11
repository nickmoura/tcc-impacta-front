import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Search,
  Bell,
  Menu,
  User,
  ChevronDown,
  UserCog,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";

// Dados mockados
const nomeClinica = "Clínica Saúde Total";

const consultasHoje = [
  {
    id: 1,
    horario: "08:00",
    paciente: "Maria Silva Santos",
    medico: "Dr. João Almeida",
    especialidade: "Cardiologia",
    status: "realizada",
    tipo: "Consulta"
  },
  {
    id: 2,
    horario: "08:30",
    paciente: "Carlos Eduardo Souza",
    medico: "Dra. Ana Paula Costa",
    especialidade: "Pediatria",
    status: "realizada",
    tipo: "Retorno"
  },
  {
    id: 3,
    horario: "09:00",
    paciente: "Fernanda Oliveira Lima",
    medico: "Dr. João Almeida",
    especialidade: "Cardiologia",
    status: "em-atendimento",
    tipo: "Consulta"
  },
  {
    id: 4,
    horario: "09:30",
    paciente: "Roberto Mendes Pereira",
    medico: "Dr. Paulo Henrique Silva",
    especialidade: "Ortopedia",
    status: "aguardando",
    tipo: "Consulta"
  },
  {
    id: 5,
    horario: "10:00",
    paciente: "Juliana Costa Ribeiro",
    medico: "Dra. Ana Paula Costa",
    especialidade: "Pediatria",
    status: "aguardando",
    tipo: "Consulta"
  },
  {
    id: 6,
    horario: "10:30",
    paciente: "Pedro Augusto Martins",
    medico: "Dr. João Almeida",
    especialidade: "Cardiologia",
    status: "aguardando",
    tipo: "Exame"
  },
  {
    id: 7,
    horario: "11:00",
    paciente: "Beatriz Alves Santos",
    medico: "Dr. Paulo Henrique Silva",
    especialidade: "Ortopedia",
    status: "aguardando",
    tipo: "Retorno"
  },
  {
    id: 8,
    horario: "14:00",
    paciente: "André Luiz Ferreira",
    medico: "Dra. Ana Paula Costa",
    especialidade: "Pediatria",
    status: "aguardando",
    tipo: "Consulta"
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "realizada":
      return {
        label: "Realizada",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        borderColor: "border-green-200"
      };
    case "em-atendimento":
      return {
        label: "Em atendimento",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        borderColor: "border-blue-200"
      };
    case "aguardando":
      return {
        label: "Aguardando",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200"
      };
    default:
      return {
        label: "Pendente",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-200"
      };
  }
};

export default function Dashboard() {
  const [sidebarAberto, setSidebarAberto] = useState(true);
  const [sidebarExpandido, setSidebarExpandido] = useState(true);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginaAtiva, setPaginaAtiva] = useState("dashboard");

  const consultasRealizadas = consultasHoje.filter(c => c.status === "realizada").length;
  const consultasAgendadas = consultasHoje.length;
  const consultasPendentes = consultasHoje.filter(c => c.status === "aguardando").length;
  const emAtendimento = consultasHoje.filter(c => c.status === "em-atendimento").length;

  const consultasFiltradas = consultasHoje.filter(consulta =>
    consulta.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consulta.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay Mobile */}
      {menuMobileAberto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuMobileAberto(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        expandido={sidebarExpandido}
        mobileAberto={menuMobileAberto}
        paginaAtiva={paginaAtiva}
        onToggleExpandido={() => setSidebarExpandido(!sidebarExpandido)}
        onCloseMobile={() => setMenuMobileAberto(false)}
        onNavigate={setPaginaAtiva}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-surface shadow-sm border-b border-border sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Menu Mobile */}
              <button
                onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                className="lg:hidden p-2 rounded-lg hover:bg-surface-soft transition-colors"
              >
                <Menu className="w-6 h-6 text-muted" />
              </button>

              {/* Título Mobile */}
              <div className="lg:hidden flex items-center gap-2">
                <span className="font-bold text-gray-900">Cliniflow</span>
              </div>

              {/* Espaçador */}
              <div className="flex-1" />

              {/* Ações do Header */}
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg hover:bg-surface-soft transition-colors">
                  <Bell className="w-5 h-5 text-muted" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-border">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-muted">Administrador</p>
                  </div>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-soft transition-colors">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-auto">
          {paginaAtiva === "dashboard" && (
            <>
              {/* Cabeçalho da Página */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Bem-vindo, {nomeClinica}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Quarta-feira, 11 de Março de 2026
                </p>
              </div>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Total Agendadas */}
                <div className="bg-surface rounded-xl shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-muted">Hoje</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {consultasAgendadas}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted">Consultas agendadas</p>
                </div>

                {/* Realizadas */}
                <div className="bg-surface rounded-xl shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-green-600">+{consultasRealizadas}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {consultasRealizadas}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted">Consultas realizadas</p>
                </div>

                {/* Em Atendimento */}
                <div className="bg-surface rounded-xl shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-secondary">Agora</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {emAtendimento}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted">Em atendimento</p>
                </div>

                {/* Pendentes */}
                <div className="bg-surface rounded-xl shadow-sm border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-muted">Fila</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {consultasPendentes}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted">Aguardando atendimento</p>
                </div>
              </div>

              {/* Quadro de Consultas */}
              <div className="bg-surface rounded-xl shadow-sm border border-border">
                {/* Cabeçalho do Quadro */}
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Consultas de Hoje
                      </h3>
                      <p className="text-xs sm:text-sm text-muted">
                        {consultasAgendadas} consultas no total
                      </p>
                    </div>
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar paciente, médico..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-surface"
                      />
                    </div>
                  </div>
                </div>

                {/* Tabela de Consultas */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-soft border-b border-border">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                          Horário
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">
                          Médico
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">
                          Especialidade
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">
                          Tipo
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface divide-y divide-border">
                      {consultasFiltradas.map((consulta) => {
                        const statusConfig = getStatusConfig(consulta.status);
                        return (
                          <tr 
                            key={consulta.id} 
                            className="hover:bg-surface-soft transition-colors cursor-pointer"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                  {consulta.horario}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {consulta.paciente}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-xs sm:text-sm text-muted">
                                {consulta.medico}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                              <div className="text-xs sm:text-sm text-muted">
                                {consulta.especialidade}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-xs sm:text-sm text-muted">
                                {consulta.tipo}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer da Tabela */}
                <div className="px-4 sm:px-6 py-4 border-t border-border bg-surface-soft">
                  <p className="text-xs sm:text-sm text-muted">
                    Mostrando {consultasFiltradas.length} de {consultasAgendadas} consultas
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Página de Gestão de Pacientes */}
          {paginaAtiva === "pacientes" && (
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Gestão de Pacientes
              </h2>
              <div className="bg-surface rounded-xl shadow-sm border border-border p-6 sm:p-8">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <UserCog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Gestão de Pacientes
                    </h3>
                    <p className="text-muted">
                      Esta funcionalidade estará disponível em breve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Página de Gestão de Médicos */}
          {paginaAtiva === "medicos" && (
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Gestão de Médicos
              </h2>
              <div className="bg-surface rounded-xl shadow-sm border border-border p-6 sm:p-8">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Gestão de Médicos
                    </h3>
                    <p className="text-muted">
                      Esta funcionalidade estará disponível em breve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}