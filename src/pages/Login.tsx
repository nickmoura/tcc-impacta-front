import React from "react";

export default function Login() {
  return (
    <div className="flex h-screen w-full">
      {/* Lado esquerdo */}
      <div className="hidden md:flex w-1/2 relative bg-blue-700">
        <img
          src="/clinic.jpg"
          alt="Clínica"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold mb-4">CliniCys</h1>
          <p className="mb-6 text-lg">
            Sistema completo de gestão para clínicas de saúde
          </p>

          <ul className="space-y-2">
            <li>• Gestão de pacientes</li>
            <li>• Agendamento inteligente</li>
            <li>• Prontuário eletrônico</li>
          </ul>
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 px-6">
        <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-2">
            Bem-vindo de volta
          </h2>

          <p className="text-gray-500 mb-6">
            Entre com suas credenciais para acessar o sistema
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Lembrar-me
              </label>

              <button
                type="button"
                className="text-blue-600 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
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