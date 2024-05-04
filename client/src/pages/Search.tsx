import React, { useEffect, useState } from "react";
import TopCommunities from "./Home/TopCommunities";
import { useSearchParams } from "react-router-dom";
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  useEffect(() => {
    console.log(query);
  }, []);
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
