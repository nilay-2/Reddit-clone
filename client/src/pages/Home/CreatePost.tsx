import React, { useState } from "react";
import Editor from "../../Components/Editor";
const CreatePost: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState("post");

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className=" border-b border-b-slate-600 mt-10 text-lg text-slate-300 pb-4">
        Create a post
      </div>
      <div className="editor mt-5">
        <div
          className="options text-white flex rounded-t-md"
          style={{ backgroundColor: "#222222" }}
        >
          <button
            className={`flex items-center px-6 py-2 gap-2 border-r border-r-slate-700 ${
              selectedItem === "post" ? "border-b-4 border-b-slate-300" : ""
            }`}
            onClick={() => {
              setSelectedItem("post");
            }}
          >
            <i className="bi bi-file-post"></i>
            <span className="font-semibold">Post</span>
          </button>
          <button
            className={`flex items-center px-6 py-2 gap-2 border-r border-r-slate-700 ${
              selectedItem === "image" ? "border-b-4 border-b-slate-300" : ""
            }`}
            onClick={() => {
              setSelectedItem("image");
            }}
          >
            <i className="bi bi-card-image"></i>
            <span className="font-semibold">Image</span>
          </button>
        </div>
        <div
          className="tiptap rounded-b-md"
          style={{ backgroundColor: "#242425" }}
        >
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
