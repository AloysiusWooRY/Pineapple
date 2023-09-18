import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Pages
import Login from "./pages/Login";
import Home from './pages/Home'
import OrganisationHome from './pages/OrganisationHome'
import Organisation from './pages/Organisation'
import NewPost from './pages/NewPost'

function App() {
  const { user } = useAuthContext();
  console.log(user)

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/organisation"
              element={user ? <OrganisationHome /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation/:id"
              element={user ? <Organisation /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation/:id/post/new"
              element={user ? <NewPost /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
