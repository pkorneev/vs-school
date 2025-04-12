import { useEffect } from "react";
import { useAtom } from "jotai";
import { lessonsAtom, tokenAtom } from "../store/store";
import { fetchLessons } from "../utils/http";

const useFetchLessons = () => {
  const [token] = useAtom(tokenAtom);
  const [, setLessons] = useAtom(lessonsAtom);

  useEffect(() => {
    if (token) {
      fetchLessons(token)
        .then((data) => {
          if (data) {
            setLessons(data);
          } else {
            console.error("No lessons fetched");
          }
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
        });
    }
  }, [token, setLessons]);
};

export default useFetchLessons;
