import TopCommunities from "../Home/TopCommunities";
import SearchResults from "./SearchResults";
const Search = () => {
  return (
    <div
      className="max-w-5xl mx-auto text-white flex gap-3 justify-between md:p-0 p-1"
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      <SearchResults />
      <TopCommunities />
    </div>
  );
};

export default Search;
