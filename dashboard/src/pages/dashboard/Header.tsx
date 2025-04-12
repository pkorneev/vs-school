import { useAtomValue, useSetAtom } from "jotai";
import { nameAtom, setTokenAtom, userAtom } from "../../store/store";
import { Button } from "antd";
import Container from "../../components/Container";
import { LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser";

const Header = () => {
  const name = useAtomValue(nameAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(setTokenAtom);

  useFetchUser();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <header>
      <Container>
        <div className="header__content">
          <Link to={"/lessons"} className="header__link">
            <div className="header__content--name">{name}</div>
          </Link>
          <Button onClick={handleLogout}>
            <LogoutOutlined />
            <span className="header__content--logout">Logout</span>
          </Button>
        </div>
      </Container>
    </header>
  );
};

export default Header;
