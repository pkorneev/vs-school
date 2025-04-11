import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tokenAtom, userAtom } from "../store/store";
import { fetchUserData } from "../utils/http";

const AuthCallback = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    if (token) {
      setToken(token);
      fetchUserData(token)
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            navigate("/");
          } else {
            console.error("No user data found");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          navigate("/login");
        });
    }
  }, [token, navigate, setToken, setUser]);

  return <p>Logging in...</p>;
};

export default AuthCallback;
