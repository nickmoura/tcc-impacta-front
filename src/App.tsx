import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/NewUser";
import Dashboard from "./pages/Dashboard";
import { authService } from "./services/authService";

function App() {
  const [loggedIn, setLoggedIn] = useState(authService.isAuthenticated());
  const [page, setPage] = useState<'login' | 'register'>('login');

  if (loggedIn) {
    return <Dashboard setLoggedIn={setLoggedIn} />;
  }

  return (
    <>
      {page === 'login' && <Login setLoggedIn={setLoggedIn} onRegister={() => setPage('register')} />}
      {page === 'register' && <Registro onBack={() => setPage('login')} />}
    </>
  );
}

export default App;