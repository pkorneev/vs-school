import { useEffect } from "react";
import { fetchLessons } from "../../utils/http";
import { useAtom, useAtomValue } from "jotai";
import { lessonsAtom, tokenAtom } from "../../store/store";
import LessonsList from "./LessonsList";

const LessonsContainer = () => {
  const token = useAtomValue(tokenAtom);
  const [lessons, setLessons] = useAtom(lessonsAtom);

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

  return <LessonsList lessons={lessons} />;
};

export default LessonsContainer;
