import { handleLogin } from "../utils/http";

const LoginPage = () => {
  return <button onClick={handleLogin}>Login with University</button>;
};

export default LoginPage;
