import AuthCallback from "./AuthCallback";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../store/store";
import Lesson from "../pages/dashboard/Lesson";
import Header from "../pages/dashboard/Header";

const Routing = () => {
  const token = useAtomValue(tokenAtom);

  return (
    <>
      <BrowserRouter>
        {token && <Header />}
        <Routes>
          <Route path="/auth/:token" element={<AuthCallback />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/lessons" replace /> : <LoginPage />}
          />
          <Route
            path="/lessons"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/lessons/:id"
            element={token ? <Lesson /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Routing;
