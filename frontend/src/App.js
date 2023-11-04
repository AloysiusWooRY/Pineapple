import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Pages
import AdminApplicationReview from "./pages/AdminApplicationReview";
import AdminModeration from './pages/AdminModeration';
import ForgotPassword from "./pages/ForgotPassword";
import Home from './pages/Home';
import Login from "./pages/Login";
import NewOrganisation from './pages/NewOrganisation';
import NewPost from './pages/NewPost';
import NotFound from "./pages/NotFound";
import Organisation from './pages/Organisation';
import OrganisationHome from './pages/OrganisationHome';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Register from "./pages/Register";
import SetupAuthenticatorQR from "./pages/SetupAuthenticatorQR";


function App() {
  const { user } = useAuthContext();
  console.log(user)

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          {/* {user ? <IdleTimerComponent /> : null} */}
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="*"
              element={<Navigate to="/not-found" />}
            />
            <Route
              path="/not-found"
              element={<NotFound />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/setup-authenticator-qr"
              element={!user ? <SetupAuthenticatorQR /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation"
              element={user ? <OrganisationHome /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation/new"
              element={user ? <NewOrganisation /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation/:id/post/:id"
              element={user ? <Post /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation/:id"
              element={user ? <Organisation /> : <Navigate to="/login" />}
            />
            <Route
              path="/organisation/:id/post/new"
              element={user ? <NewPost /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/moderation"
              element={user ? <AdminModeration /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin/application"
              element={user ? <AdminApplicationReview /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
