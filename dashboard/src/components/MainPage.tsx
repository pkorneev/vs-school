import { useAtomValue } from "jotai";
import { userAtom } from "../store/store";
import AuthCallback from "./AuthCallback";

const MainPage = () => {
  const user = useAtomValue(userAtom);
  const name = user?.name ?? null;

  return name ? <h2>{name}</h2> : <AuthCallback />;
};

export default MainPage;
