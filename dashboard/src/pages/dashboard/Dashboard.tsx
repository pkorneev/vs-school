import { Link } from "react-router-dom";
import Container from "../../components/Container";
import LessonsContainer from "./lessons/LessonsContainer";
import { useAtomValue } from "jotai";
import { tokenAtom } from "../../store/store";

const Dashboard = () => {
  const token = useAtomValue(tokenAtom);

  if (!token) {
    return (
      <>
        <h1>You are not authenticated</h1>
        <Link to={"/login"}>Go to login page</Link>
      </>
    );
  }

  return (
    <>
      <Container>
        <div className="dashboard__container">
          <LessonsContainer />
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
