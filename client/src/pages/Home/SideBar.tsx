import React from "react";

const SideBar: React.FC = () => {
  return (
    <div
      className="w-1/6 md:block hidden mt-4 h-fit rounded-lg"
      style={{ backgroundColor: "#28282B" }}
    >
      <div className="list-container border-b border-b-slate-800">
        <div className="p-2 text-sm text-slate-400">Recent</div>
        <ul className="mt-2 pl-4">
          {[1, 2, 3, 4, 5].map((_, i) => {
            return (
              <li
                key={i}
                className="p-2 text-slate-200 w-full flex items-center"
              >
                <i className="bi bi-person-circle text-2xl mr-2"></i>
                <span>r/lorem</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
