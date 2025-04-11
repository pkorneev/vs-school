import { useAtomValue, useSetAtom } from "jotai";
import { tokenAtom, userAtom } from "../store/store";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const token = useAtomValue(tokenAtom);
  const setToken = useSetAtom(tokenAtom);
  const user = useAtomValue(userAtom);
  const name = user?.name ?? "";

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
      <h2>{name}</h2>
      <button onClick={() => setToken(null)}>Logout</button>
    </>
  );
};

export default Dashboard;
