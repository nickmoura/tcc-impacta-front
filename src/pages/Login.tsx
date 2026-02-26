import React from "react";
import '../assets/css/login.css';
import heroPic from '../assets/img/side-view-smiley-doctor-taking-notes.jpg';

export default function Login() {
  interface LogoProps {
    width?: number;
    height?: number;
    text?: string;
    bg?: string;
    color?: string;
  }

  const Logo: React.FC<LogoProps> = ({
    width = 200,
    height = 80,
    text = "Logo",
    bg = "000000",
    color = "FFFFFF",
  }) => {
    const url = `https://placehold.co/${width}x${height}/${bg}/${color}?text=${encodeURIComponent(
      text
    )}`;
    return (
      <img
        src={url}
        alt={text}
        width={width}
        height={height}
        className="mb-6"
      />
    );
  };

  return (
    <div className="flex h-screen w-full">
      {/* Lado esquerdo */}
      <div className="hidden md:flex w-3/5 relative login-hero">
        <img
          src={heroPic}
          alt="Clínica"
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Lado direito */}
      <div className="flex flex-col w-full md:w-2/5 items-center justify-center bg-gray-100 px-6">
        <Logo width={100} height={100} />
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">
          <form className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between text-lg">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Lembrar-me
              </label>

              <button type="button" className="text-blue-600 hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-3xl text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem uma conta?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Solicite acesso
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}