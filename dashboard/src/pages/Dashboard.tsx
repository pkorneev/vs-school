import { useAtomValue } from "jotai";
import { userAtom } from "../store/store";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = useAtomValue(userAtom);
  const name = user?.name ?? null;

  if (!name) {
    return (
      <>
        <h1>You are not authenticated</h1>
        <Link to={"/login"}>Go to login page</Link>
      </>
    );
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
