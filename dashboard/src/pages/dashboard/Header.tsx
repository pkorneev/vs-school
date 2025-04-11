import { useAtomValue, useSetAtom } from "jotai";
import { nameAtom, setTokenAtom, tokenAtom, userAtom } from "../../store/store";
import { Button } from "antd";
import Container from "../../components/Container";
import { LogoutOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { fetchUserData } from "../../utils/http";
import { Link } from "react-router-dom";

const Header = () => {
  const name = useAtomValue(nameAtom);
  const token = useAtomValue(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(setTokenAtom);

  useEffect(() => {
    if (token) {
      fetchUserData(token)
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          } else {
            console.error("No user data found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [token, setUser]);

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
