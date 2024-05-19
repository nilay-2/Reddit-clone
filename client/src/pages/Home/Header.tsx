import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Auth from "./Auth";
import { verify } from "../../app/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import UserProfileBar from "../../Components/UserProfileBar";
import { fetchPosts } from "../../app/reducers/postsReducer";
import { useNavigate } from "react-router-dom";
import {
  setSearchQuery,
  fullTextSearch,
} from "../../app/reducers/searchReducer";
import { useSearchParams } from "react-router-dom";
const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  // toggle state
  const [openAuth, setOpenAuth] = useState<Boolean>(false);
  const [query, setQuery] = useState<string>("");
  // redux state
  const authState = useSelector((state: RootState) => state.auth);
  const postState = useSelector((state: RootState) => state.posts);
  const searchState = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch<AppDispatch>();

  const authHandler = () => {
    setOpenAuth(true);
  };

  useEffect(() => {
    dispatch(fetchPosts({ page: postState.page, offset: postState.offset }));
  }, [postState.page]);

  useEffect(() => {
    dispatch(verify());
    if (searchState.query) {
      dispatch(fullTextSearch(searchState.query));
    } else {
      dispatch(fullTextSearch(searchParams.get("q")!));
    }
  }, []);

  const searchHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
    dispatch(fullTextSearch(query));
    navigate(`/search?q=${query}`);
  };

  const searchChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setQuery(e.target.value);
  };

  const IsLoggedIn: React.FC = () => {
    if (authState.loading) {
      return <div className="text-white">Loading...</div>;
    }
    if (!authState.id) {
      return (
        <button
          onClick={authHandler}
          className="md:py-2 md:px-5 px-4 py-1 rounded-full bg-orange-600 text-white md:font-semibold hover:bg-orange-500 active:bg-orange-700 flex justify-center items-center text-xs md:text-base"
        >
          Log in
        </button>
      );
    }
    return <UserProfileBar />;
  };

  return (
    <div
      className="w-screen h-screen mx-auto p-2 z-0 overflow-x-hidden"
      style={{ maxWidth: "2000px" }}
    >
      <div className="mx-auto" style={{ maxWidth: "1400px" }}>
        <header className="flex lg:gap-14 gap-3 justify-between p-1 items-center md:static sticky top-0">
          {/* logo */}
          <Link to={"/"}>
            <div className="logo flex items-center gap-1">
              <img src="/socialit.png" alt="" height={38} width={38} />
              <span className="text-3xl bg-gradient-to-r from-pink-400 to-pink-700 text-transparent bg-clip-text font-bold">
                socialit
              </span>
            </div>
          </Link>
          {/* search-bar */}
          <div
            className="search-bar grow rounded-full px-4 max-w-4xl flex items-center"
            style={{ backgroundColor: "#28282B" }}
          >
            <form className="w-full" onSubmit={searchHandler}>
              <div className="input-group flex items-center">
                <i className="bi bi-search text-xl h-full p-1 text-slate-600"></i>
                <input
                  type="text"
                  placeholder="Search...."
                  className="w-full p-2 outline-none text-white"
                  style={{ backgroundColor: "#28282B" }}
                  value={query}
                  onChange={searchChangeHandler}
                />
              </div>
            </form>
          </div>
          {/* options-bar */}
          <div className="options-bar">
            <IsLoggedIn />
          </div>
        </header>
        <main className="mt-2">
          <Outlet />
        </main>
      </div>
      {openAuth && <Auth setOpenAuth={setOpenAuth} />}
    </div>
  );
};

export default Header;
