import SideBar from "./SideBar";
import TopCommunities from "./TopCommunities";
import Feed from "./Feed";
function App() {
  return (
    <div
      className="mx-auto text-white flex gap-3 justify-between lg:p-0 p-1"
      style={{ maxWidth: "1300px", height: "calc(100vh - 70px)" }}
    >
      {/* welcome to the reddit clone app{" "} */}
      <SideBar />
      <Feed />
      <TopCommunities />
    </div>
  );
}

export default App;
