import { authService } from "../services/authService";

interface DashboardProps {
  setLoggedIn: (value: boolean) => void;
}

export default function Dashboard({ setLoggedIn }: DashboardProps) {
	return (
    <div className="flex flex-col h-full justify-center items-center">
			<header className="w-full bg-white shadow p-4 flex flex-col justify-center items-center">
				<h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
				<button
					onClick={() => {
						authService.logout();
						setLoggedIn(false);
					}}
					className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
				>
					Logout
				</button>
			</header>
			<main className="flex-1 p-6">
				<p className="text-gray-600">Ainda em desenvolvimento.</p>
			</main>
		</div>
	)
}