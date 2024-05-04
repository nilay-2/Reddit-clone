import React, { useEffect, useState } from "react";
import TopCommunities from "./Home/TopCommunities";
import { useSearchParams } from "react-router-dom";
import { getAccessControlAllowOriginUrl, getFetchUrl } from "../utils/appUrl";
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const query = searchParams.get("q") ?? "";
    console.log(query);
    const getData = async () => {
      const res = await fetch(
        `${getFetchUrl()}/api/posts/search?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": getAccessControlAllowOriginUrl(),
          },
        }
      );
      const jsonRes = await res.json();
      console.log(jsonRes);
    };
    getData();
  });
  return (
    <div
      className="max-w-5xl mx-auto text-white flex gap-3 justify-between md:p-0 p-1 border border-red-500"
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      <TopCommunities />
    </div>
  );
};

export default Search;
