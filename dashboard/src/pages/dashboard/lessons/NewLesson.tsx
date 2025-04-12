import { Link } from "react-router-dom";
import Container from "../../../components/Container";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import FormContainer from "../form/FormContainer";

const NewLesson = () => {
  return (
    <Container>
      <div className="lesson__container">
        <Link to={"/lessons"} style={{ width: "fit-content" }}>
          <Button>
            <ArrowLeftOutlined /> Back
          </Button>
        </Link>
        <FormContainer />
      </div>
    </Container>
  );
};

export default NewLesson;
