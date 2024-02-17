import SideBar from "./SideBar";
import TopCommunities from "./TopCommunities";
import Feed from "./Feed";
function App() {
  return (
    <div
      className="max-w-5xl mx-auto text-white flex gap-3 justify-between md:p-0 p-1"
      style={{
        // maxWidth: "1300px",
        height: "calc(100vh - 70px)",
      }}
    >
      {/* <SideBar /> */}
      <Feed />
      <TopCommunities />
    </div>
  );
}

export default App;
