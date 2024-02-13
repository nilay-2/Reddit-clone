import React from "react";

const TopCommunities: React.FC = () => {
  return (
    <div
      className="w-60 md:w-72 p-2 rounded-lg sm:block hidden mt-4 h-fit"
      style={{ backgroundColor: "#28282B" }}
    >
      <p className="text-slate-400 p-2">Popular Communities</p>

      <ul className="mt-2 pl-4">
        {[1, 2, 3, 4, 5].map((_, i) => {
          return (
            <li key={i} className="p-2 text-slate-400 w-full flex items-center">
              <i className="bi bi-person-circle text-2xl mr-2"></i>
              <div>
                <p className="text-slate-200">r/lorem</p>
                <p className="text-xs text-slate-500">2,333,3444</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopCommunities;
