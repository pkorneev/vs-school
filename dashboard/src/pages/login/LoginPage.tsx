import { Button, Flex } from "antd";
import Container from "../../components/Container";
import { handleLogin } from "../../utils/http";

const LoginPage = () => {
  return (
    <Container>
      <Flex
        gap="middle"
        align="center"
        justify="center"
        vertical
        style={{ height: "100vh" }}
      >
        <h1>Welcome to the VS-School Dashboard</h1>
        <Button type="primary" onClick={handleLogin}>
          Login with University
        </Button>
      </Flex>
    </Container>
  );
};

export default LoginPage;
