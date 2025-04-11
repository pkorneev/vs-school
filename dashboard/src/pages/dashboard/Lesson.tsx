import { Link, useLocation } from "react-router-dom";
import FormContainer from "./form/FormContainer";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Container from "../../components/Container";

const Lesson = () => {
  const location = useLocation();
  const lesson = location.state?.lesson;

  if (!lesson) {
    return <p>Lesson not found.</p>;
  }

  return (
    <Container>
      <div className="lesson__container">
        <Link to={"/lessons"} style={{ width: "fit-content" }}>
          <Button>
            <ArrowLeftOutlined /> Back
          </Button>
        </Link>
        <FormContainer lesson={lesson} />
      </div>
    </Container>
  );
};

export default Lesson;
