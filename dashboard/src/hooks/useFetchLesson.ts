import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { lessonAtom, lessonLoadingAtom, tokenAtom } from "../store/store";
import { fetchLessonById } from "../utils/http";
import { useParams } from "react-router-dom";

const useFetchLesson = () => {
  const { id } = useParams();
  const [, setLesson] = useAtom(lessonAtom);
  const [token] = useAtom(tokenAtom);
  const [, setLoading] = useAtom(lessonLoadingAtom);

  const refetch = useCallback(() => {
    if (token && id) {
      setLoading(true);
      fetchLessonById(id, token)
        .then((data) => {
          if (data) {
            setLesson(data);
          } else {
            console.error("No lesson data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching lesson data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, id, setLesson, setLoading]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return refetch;
};

export default useFetchLesson;
