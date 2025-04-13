import { Link } from "react-router-dom";
import FormContainer from "../form/FormContainer";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Container from "../../../components/Container";

import useFetchLesson from "../../../hooks/useFetchLesson";
import { useAtomValue } from "jotai";
import { lessonAtom, lessonLoadingAtom } from "../../../store/store";

const Lesson = () => {
  const lesson = useAtomValue(lessonAtom);
  const isLoading = useAtomValue(lessonLoadingAtom);
  const refetch = useFetchLesson();

  if (isLoading || !lesson) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <Container>
      <div className="lesson__container">
        <Link to={"/lessons"} style={{ width: "fit-content" }}>
          <Button>
            <ArrowLeftOutlined /> Back
          </Button>
        </Link>
        <FormContainer lesson={lesson} refetchLesson={refetch} />
      </div>
    </Container>
  );
};

export default Lesson;
