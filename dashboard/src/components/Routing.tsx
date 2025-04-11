import { useAtomValue } from "jotai";
import { userAtom } from "../store/store";
import AuthCallback from "./AuthCallback";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";

const Routing = () => {
  const user = useAtomValue(userAtom);
  const name = user?.name ?? null;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/:token" element={<AuthCallback />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      {name && <h2>{name}</h2>}
    </>
  );
};

export default Routing;
