import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/NewUser";

function App() {
  const [loggedIn] = useState(false);
  const [page, setPage] = useState<'login' | 'register'>('login');

  if (loggedIn) {
    return <div>Bem-vindo!</div>;
  }

  return (
    <>
      {page === 'login' && <Login onRegister={() => setPage('register')} />}
      {page === 'register' && <Registro onBack={() => setPage('login')} />}
    </>
  );
}

export default App;