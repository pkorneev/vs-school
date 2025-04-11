import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <div className="container">{children}</div>;
};

export default Container;
