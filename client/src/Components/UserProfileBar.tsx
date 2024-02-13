import React from "react";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const UserProfileBar: React.FC = (): JSX.Element => {
  const state = useSelector((state: RootState) => state.auth);

  return (
    <div className="text-white md:flex gap-2 rounded-xl hidden">
      <button className="flex items-center justify-center w-7 h-7  hover:bg-reddit p-1">
        <i className="bi bi-chat-dots "></i>
      </button>
      <button className="flex items-center justify-center w-7 h-7  hover:bg-reddit p-1">
        <i className="bi bi-bell "></i>
      </button>
      <Link to={"/submit"}>
        <button className="flex items-center justify-center w-7 h-7  hover:bg-reddit p-1">
          <i className="bi bi-plus-lg"></i>
        </button>
      </Link>
      <button className="flex items-center justify-center w-7 h-7  hover:bg-reddit p-1">
        <i className="bi bi-person-fill"></i>
      </button>
    </div>
  );
};

export default UserProfileBar;
