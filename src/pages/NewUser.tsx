import React, { useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import logoCliniflow from '../assets/img/cliniflow-high-resolution-logo.png';
import Hero from "../components/Hero";
import mascaraCnpj from '../utils/mascaras';
import toast, { Toaster } from 'react-hot-toast';
import { authService } from '../services/authService';

interface RegistroProps {
	onBack?: () => void;
}

export default function Registro({ onBack }: RegistroProps) {
	const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
	const [nome, setNome] = useState<string>("");
	const [cnpj, setCnpj] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [senha, setSenha] = useState<string>("");
	const [clinic, setClinic] = useState<{ id: number; nome: string; cnpj: string } | null>(null);
	const [clinicError, setClinicError] = useState<string>("");
	const [clinicLoading, setClinicLoading] = useState<boolean>(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const masked = mascaraCnpj(e.target.value);
		setCnpj(masked);
		setClinic(null);
		setClinicError("");
	}

	async function handleCnpjBlur() {
		const cleanCnpj = cnpj.replace(/\D/g, '');
		if (cleanCnpj.length !== 14) {
			return;
		}

		try {
			setClinicLoading(true);
			setClinicError("");

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/clinic?cnpj=${cleanCnpj}`
			);

			const data = await response.json();

			if (!response.ok) {
				console.warn("Clinic lookup failed", response.status, data);
				throw new Error("Clínica não encontrada");
			}

			let payload: unknown = data;
			if (Array.isArray(data) && data.length > 0) {
				payload = data[0];
			}
			if (typeof payload === 'object' && payload !== null && 'clinic' in payload) {
				payload = (payload as { clinic: unknown }).clinic;
			}

			const payloadObj = typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {};
			const clinicId = payloadObj['id'] ?? payloadObj['ID'] ?? payloadObj['Id'];
			const clinicName = payloadObj['nome'] ?? payloadObj['name'] ?? payloadObj['Nome'];
			const clinicCnpj = payloadObj['cnpj'] ?? payloadObj['CNPJ'] ?? payloadObj['Cnpj'] ?? cleanCnpj;

			if (!clinicId || !clinicName) {
				console.warn("Clinic payload missing required fields", payload);
				throw new Error("Dados inválidos da clínica");
			}

			setClinic({
				id: Number(clinicId),
				nome: String(clinicName),
				cnpj: String(clinicCnpj),
			});
		} catch (error) {
			console.warn("Clinic lookup error", error);
			setClinic(null);
			setClinicError("CNPJ não encontrado. Verifique e tente novamente.");
		} finally {
			setClinicLoading(false);
		}
	}
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		const cleanCnpj = cnpj.replace(/\D/g, '');
		event.preventDefault();

		// Validação dos campos
		if (!nome.trim()) {
			toast.error("Por favor, preencha o nome completo.", { duration: 3000 });
			return;
		}
		if (!cnpj.trim()) {
			toast.error("Por favor, preencha o CNPJ da clínica.", { duration: 3000 });
			return;
		}
		if (cleanCnpj.length < 14) {
			toast.error("Por favor, preencha um CNPJ válido.", { duration: 3000 });
			return;
		}
		if (!email.trim()) {
			toast.error("Por favor, preencha o e-mail.", { duration: 3000 });
			return;
		}
		if (!senha.trim()) {
			toast.error("Por favor, preencha a senha.", { duration: 3000 });
			return;
		}

		try {
			const response = await authService.register({
				nome,
				cnpj: cleanCnpj,
				email,
				password: senha,
			});

			const data = await response.json();

			if (response.ok) {
				console.log("Registro realizado com sucesso:", data);
				toast.success("Registro realizado com sucesso!");
				setTimeout(() => {
					onBack?.();
				}, 2000);
			} else {
				console.error("Erro ao registrar:", data);
				toast.error("Erro ao registrar. Por favor, tente novamente.", {
					duration: 3000,
				});
			}

		} catch (error) {
			console.error("Erro ao conectar com o servidor:", error);
			toast.error("Erro ao conectar com o servidor. Por favor, tente novamente.", {
				duration: 3000,
			});
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
				<div
					className="mb-14 flex items-center justify-center overflow-hidden rounded-[2.5rem] shadow-md bg-[#1d4ed8]"
					style={{
						width: `220px`,
						height: `220px`,
					}}
				>
					<img
						src={logoCliniflow}
						alt="CliniFlow Logo"
						className="w-full h-full object-cover p-2"
					/>
				</div>

				<div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<input
								type="text"
								placeholder="Nome completo"
								className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
							/>
						</div>
						<div>
							<input
								type="text"
								placeholder="CNPJ da clínica"
								id="cnpj"
								maxLength={18}
								className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={cnpj}
								onChange={handleChange}
								onBlur={handleCnpjBlur}
							hidden={!!clinic}
							/>
							{clinic && (
								<div className="relative">
									<select
										disabled
										className="w-full border border-gray-300 rounded-lg bg-gray-100 text-gray-700 p-3 pr-10 cursor-not-allowed"
									>
										<option value={clinic.id}>
											{`${clinic.nome} - ${mascaraCnpj(clinic.cnpj)}`}
										</option>
									</select>
									<button
										type="button"
										onClick={() => {
											setClinic(null);
											setClinicError("");
											setCnpj("");
										}}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
										title="Limpar clínica"
									>
										<Trash2 size={20} className="mr-3"/>
									</button>
								</div>
							)}
							{clinicLoading && (
								<p className="mt-2 text-sm text-blue-600">Buscando clínica...</p>
							)}
							{clinicError && (
								<p className="mt-2 text-sm text-red-600">{clinicError}</p>
							)}
						</div>
						<div>
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
							Registrar
						</button>
					</form>
					<div className="text-center mt-4">
						<span className="text-gray-500">
							Já tem uma conta?{' '}
							<button
								type="button"
								onClick={onBack}
								className="text-blue-700 hover:underline"
							>
								Entrar
							</button>
						</span>
					</div>
				</div>
			</div>
			<Toaster />
		</div>
	);
}