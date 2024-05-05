import PostElement from "../../Components/Post";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
const SearchResults = () => {
  const searchState = useSelector((state: RootState) => state.search);

  const [searchParams, _] = useSearchParams();

  const getSerachQuery = (): string => {
    if (searchState.query) return searchState.query;
    return searchParams.get("q") ?? "";
  };

  if (searchState.isLoading) {
    return <p>Loading.....</p>;
  }

  if (
    !searchState.isLoading &&
    (!searchState.data || !searchState.data.length)
  ) {
    return (
      <p className="text-stone-400">
        Your search -{" "}
        <span className="font-bold text-slate-200">{getSerachQuery()}</span> did
        not match any document
      </p>
    );
  }

  return (
    <div className="grow md:px-2 px-1 pb-2 flex flex-col gap-4 overflow-auto">
      {searchState.data.map((post, i) => {
        return <PostElement key={i} post={post} overview={true} />;
      })}
    </div>
  );
};

export default SearchResults;
