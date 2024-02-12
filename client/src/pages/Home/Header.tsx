import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Auth from "./Auth";
import { verify } from "../../app/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
const Header: React.FC = () => {
  const [openAuth, setOpenAuth] = useState<Boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const authHandler = () => {
    setOpenAuth(true);
  };

  useEffect(() => {
    dispatch(verify());
  }, [dispatch]);

  return (
    <div
      className="w-screen h-screen mx-auto p-2 z-0"
      style={{ maxWidth: "2000px" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1400px" }}>
        <header className="flex lg:gap-14 gap-3 justify-between p-1 items-center border-b border-b-slate-800">
          {/* logo */}
          <div className="logo">
            <i className="bi bi-reddit text-4xl text-orange-600"></i>
          </div>
          {/* search-bar */}
          <div
            className="search-bar grow rounded-full px-4 max-w-4xl"
            style={{ backgroundColor: "#17282a" }}
          >
            <form className="w-full">
              <div className="input-group flex items-center">
                <i className="bi bi-search text-xl h-full p-1 text-slate-600"></i>
                <input
                  type="text"
                  placeholder="Search Reddit"
                  className="w-full p-2 outline-none text-white"
                  style={{ backgroundColor: "#17282a" }}
                />
              </div>
            </form>
          </div>
          {/* options-bar */}
          <div className="options-bar">
            <button
              onClick={authHandler}
              className="md:py-2 md:px-5 px-4 py-1 rounded-full bg-orange-600 text-white md:font-semibold hover:bg-orange-500 active:bg-orange-700 flex justify-center items-center text-xs md:text-base"
            >
              {authState.username}
            </button>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {openAuth && <Auth setOpenAuth={setOpenAuth} />}
    </div>
  );
};

export default Header;
