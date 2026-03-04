import React, { useState } from "react";
import '../assets/css/login.css';
import { Eye, EyeOff } from "lucide-react";
import logoCliniflow from '../assets/img/cliniflow-high-resolution-logo.png';
import Hero from "../components/Hero";
interface LogoProps {
  width?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 150 }) => (
  <div
    className="mb-14 flex items-center justify-center overflow-hidden rounded-[2.5rem] shadow-md bg-[#1d4ed8]"
    style={{
      width: `${width}px`,
      height: `${width}px`
    }}
  >
    <img
      src={logoCliniflow}
      alt="CliniFlow Logo"
      className="w-full h-full object-cover p-2"
    />
  </div>
);

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      const data = await response.json();

      console.log("Resposta do backend:", data);

    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Lado esquerdo */}
      <div className="hero-container hidden md:flex w-3/5 relative">
        <Hero />
      </div>

      {/* Lado direito */}
      <div className="flex flex-col w-full md:w-2/5 items-center justify-center bg-gray-50 px-6">
        <Logo width={220} />

        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">            <div>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white p-3 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Entrar
            </button>
            <div className="no-username-container text-center"><span className="text-gray-500">Não tem uma conta? <a href="/register" className="text-blue-700 hover:underline">Cadastre-se aqui</a></span></div>
          </form>
        </div>
      </div>
    </div>
  );
}