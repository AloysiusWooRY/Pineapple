import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { Toaster } from 'react-hot-toast';

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from './pages/Profile';
import Home from './pages/Home';
import OrganisationHome from './pages/OrganisationHome';
import Organisation from './pages/Organisation';
import Post from './pages/Post';
import NewPost from './pages/NewPost';
import NewOrganisation from './pages/NewOrganisation';
import AdminModeration from './pages/AdminModeration';
import AdminApplicationReview from "./pages/AdminApplicationReview";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import IdleTimerComponent from "./components/IdleTimerComponent";

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
            {user ? <IdleTimerComponent /> : null}
            <Routes>
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="*"
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
