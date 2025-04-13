import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
const H1 = ({ children }: Props) => {
  return <h1 className="page__header">{children}</h1>;
};

export default H1;
