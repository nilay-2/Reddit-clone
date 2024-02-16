import React from "react";
import { RootState, AppDispatch } from "../app/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Protect {
  children: React.ReactNode;
}

const Protect: React.FC<Protect> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  if (!authState.id) {
    navigate("/");
    return null;
  }

  return <>{children}</>;
};

export default Protect;
