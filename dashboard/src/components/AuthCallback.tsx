import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setTokenAtom } from "../store/store";

const AuthCallback = () => {
  const { token } = useParams();
  const setToken = useSetAtom(setTokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setToken(token);
      navigate("/");
    }
  }, [token, setToken, navigate]);

  return <p>Logging in...</p>;
};

export default AuthCallback;
