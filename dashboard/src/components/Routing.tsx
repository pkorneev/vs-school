import { useAtomValue } from "jotai";
import AuthCallback from "./AuthCallback";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import { tokenAtom } from "../store/store";

const Routing = () => {
  const token = useAtomValue(tokenAtom);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/:token" element={<AuthCallback />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <LoginPage />}
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
