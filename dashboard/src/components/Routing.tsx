import AuthCallback from "./AuthCallback";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
import { useAtomValue, useSetAtom } from "jotai";
import { notificationApiAtom, tokenAtom } from "../store/store";
import Lesson from "../pages/dashboard/lesson/Lesson";
import Header from "../pages/dashboard/Header";
import NewLesson from "../pages/dashboard/lesson/NewLesson";
import { notification } from "antd";
import { useEffect } from "react";

const Routing = () => {
  const token = useAtomValue(tokenAtom);
  const [api, contextHolder] = notification.useNotification();
  const setNotificationApi = useSetAtom(notificationApiAtom);

  useEffect(() => {
    setNotificationApi(api);
  }, [api, setNotificationApi]);

  return (
    <>
      <BrowserRouter>
        {contextHolder}
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
            path="/create"
            element={token ? <NewLesson /> : <Navigate to="/login" replace />}
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
