import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/NewUser";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import { authService } from "./services/authService";
import Doctors from "./pages/Doctors";

function App() {
  const [loggedIn, setLoggedIn] = useState(authService.isAuthenticated());
  const [page, setPage] = useState<'login' | 'register'>('login');

  if (loggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard setLoggedIn={setLoggedIn} />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
        </Routes>
      </Router>
    );
  }

  return (
    <>
      {page === 'login' && <Login setLoggedIn={setLoggedIn} onRegister={() => setPage('register')} />}
      {page === 'register' && <Registro onBack={() => setPage('login')} />}
    </>
  );
}

export default App;