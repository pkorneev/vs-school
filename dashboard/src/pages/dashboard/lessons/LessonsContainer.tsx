import LessonsList from "./LessonsList";
import useFetchLessons from "../../../hooks/useFetchLessons";
import { useAtomValue } from "jotai";
import { lessonsAtom } from "../../../store/store";
import H1 from "../../../components/H1";

const LessonsContainer = () => {
  const lessons = useAtomValue(lessonsAtom);
  useFetchLessons();

  return (
    <>
      <H1>List of the lessons</H1>
      <div className="lessons__container">
        <LessonsList lessons={lessons} />
      </div>
    </>
  );
};

export default LessonsContainer;
