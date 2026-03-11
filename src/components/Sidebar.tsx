import {
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCog,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import logoTransparent from "../assets/img/cliniflow-high-resolution-logo-grayscale-transparent.png";

interface MenuItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface SidebarProps {
  expandido: boolean;
  mobileAberto: boolean;
  paginaAtiva: string;
  onToggleExpandido: () => void;
  onCloseMobile: () => void;
  onNavigate: (pagina: string) => void;
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pacientes", label: "Gestão de Pacientes", icon: UserCog },
  { id: "medicos", label: "Gestão de Médicos", icon: Stethoscope },
];

export function Sidebar({
  expandido,
  mobileAberto,
  paginaAtiva,
  onToggleExpandido,
  onCloseMobile,
  onNavigate,
}: SidebarProps) {
  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-screen bg-surface border-r border-border z-50 transition-all duration-300 ${expandido ? "w-64" : "w-20"
        } ${mobileAberto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 border-b border-border flex items-center justify-between px-4">
          {expandido ? (
            <>
              <div className="flex items-center gap-3">
                <img
                  src={logoTransparent}
                  alt="Cliniflow"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 hover:bg-surface-soft rounded"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </>
          ) : (
            <img
              src={logoTransparent}
              alt="Cliniflow"
              className="h-8 w-8 object-contain mx-auto"
            />
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isAtivo = paginaAtiva === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isAtivo
                        ? "bg-primary text-white"
                        : "text-muted hover:bg-surface-soft"
                      } ${!expandido && "justify-center"}`}
                    title={!expandido ? item.label : ""}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {expandido && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            {expandido && (
              <button
                className="flex-[3] flex items-center gap-3 justify-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                title="Sair"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">Sair</span>
              </button>
            )}
            <button
              onClick={onToggleExpandido}
              className="flex-[1] hidden lg:flex items-center justify-center px-3 py-2 rounded-lg text-muted hover:bg-surface-soft transition-all"
              title={expandido ? "Recolher menu" : "Expandir menu"}
            >
              {expandido ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
