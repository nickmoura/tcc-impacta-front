import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { authService } from "./services/authService";

function App() {
  const [loggedIn, setLoggedIn] = useState(authService.isAuthenticated());
  // const [page, setPage] = useState<'login' | 'dashboard'>('login');
  if (loggedIn) {
    return <Dashboard setLoggedIn={setLoggedIn} />;
  } else {
    return <Login setLoggedIn={setLoggedIn} />;
  }

}

export default App;