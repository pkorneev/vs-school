import { useEffect } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../store/store";
import { fetchUserData } from "../utils/http";

const useFetchUser = () => {
  const [token] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    if (token) {
      fetchUserData(token)
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          } else {
            console.error("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [token, setUser]);
};

export default useFetchUser;
