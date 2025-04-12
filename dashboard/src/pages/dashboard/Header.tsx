import { useAtomValue, useSetAtom } from "jotai";
import { nameAtom, setTokenAtom, userAtom } from "../../store/store";
import { Button } from "antd";
import Container from "../../components/Container";
import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import useFetchUser from "../../hooks/useFetchUser";

const Header = () => {
  const name = useAtomValue(nameAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(setTokenAtom);
  const navigate = useNavigate();

  useFetchUser();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  const handleAddNew = () => {
    navigate("/create");
  };

  return (
    <header>
      <Container>
        <div className="header__content">
          <Link to={"/lessons"} className="header__link">
            <div className="header__content--name">{name}</div>
          </Link>

          <div className="header__content--buttons">
            <Button onClick={handleAddNew} type="primary">
              <PlusOutlined />
              <span className="header__content--logout">Add new</span>
            </Button>
            <Button onClick={handleLogout}>
              <LogoutOutlined />
              <span className="header__content--logout">Logout</span>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
