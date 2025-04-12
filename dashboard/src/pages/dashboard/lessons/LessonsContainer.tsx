import LessonsList from "./LessonsList";
import useFetchLessons from "../../../hooks/useFetchLessons";
import { useAtomValue } from "jotai";
import { lessonsAtom } from "../../../store/store";

const LessonsContainer = () => {
  const lessons = useAtomValue(lessonsAtom);
  useFetchLessons();

  return <LessonsList lessons={lessons} />;
};

export default LessonsContainer;
