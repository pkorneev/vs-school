import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../form/FormContainer";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Container from "../../../components/Container";

import useFetchLesson from "../../../hooks/useFetchLesson";
import { useAtomValue, useSetAtom } from "jotai";
import {
  lessonAtom,
  lessonLoadingAtom,
  notifyAtom,
  tokenAtom,
} from "../../../store/store";
import { deleteLesson } from "../../../utils/http";
import H1 from "../../../components/H1";

const Lesson = () => {
  const { id } = useParams();
  const notify = useSetAtom(notifyAtom);
  const token = useAtomValue(tokenAtom);
  const navigate = useNavigate();
  const lesson = useAtomValue(lessonAtom);
  const isLoading = useAtomValue(lessonLoadingAtom);
  const refetch = useFetchLesson();

  const handleDeleteLesson = async () => {
    if (token && id) {
      try {
        await deleteLesson(Number(id), token);
        console.log("Lesson deleted successfully");
        notify({
          type: "success",
          description: "Lesson deleted successfully!",
        });
        navigate("/lessons");
      } catch (err) {
        console.error(err);
        notify({
          type: "error",
          description: "Error while deleting lesson!",
        });
      }
    }
  };

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
        <H1>Edit lesson</H1>
        <div className="lesson__container--buttons">
          <Link to={"/lessons"} style={{ width: "fit-content" }}>
            <Button>
              <ArrowLeftOutlined /> Back
            </Button>
          </Link>
          <Button color="danger" variant="solid" onClick={handleDeleteLesson}>
            Delete lesson
          </Button>
        </div>
        <FormContainer lesson={lesson} refetchLesson={refetch} />
      </div>
    </Container>
  );
};

export default Lesson;
