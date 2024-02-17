import React from "react";

const Post: React.FC = () => {
  return (
    <div className="max-w-4xl h-auto rounded-lg mx-auto hover:bg-reddit bg-redditPost hover:border hover:border-opacity-5 hover:border-stone-500 flex">
      <div
        className="votes w-24 rounded-s-lg md:flex hidden flex-col items-center pt-4"
        style={{ backgroundColor: "#151515" }}
      >
        <div className="btn-vote-group flex flex-col gap-2">
          <i className="bi bi-hand-thumbs-up hover:text-red-600 cursor-pointer text-xl text-slate-300"></i>
          <div className="text-sm">133</div>
          <i className="bi bi-hand-thumbs-down hover:text-red-600 cursor-pointer text-xl text-slate-300"></i>
        </div>
      </div>
      <div className="posts-content md:p-3 p-1">
        <div className="post-author-details flex justify-between">
          <div className="flex gap-1 items-center text-slate-400 text-sm">
            <i className="bi bi-person-circle text-2xl mr-2"></i>
            <p>u/lorem</p>
          </div>

          <div className="h-fit max-h-4">
            <button className="px-4 py-1 rounded-md bg-blue-700 text-xs hover:bg-blue-500 active:bg-blue-700">
              Join
            </button>
          </div>
        </div>
        <div className="text-content">
          <p className="title mt-2 text-xl font-semibold">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consequatur?
          </p>
          <p className="content mt-2 text-sm font-light text-slate-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            blanditiis ratione magnam doloribus voluptatibus rem officiis
            eveniet temporibus veritatis at. Laborum culpa repudiandae
            temporibus beatae natus quia ab ipsam minima?
          </p>
        </div>
        <div className="btn-group flex gap-4 mt-6 items-center">
          <div className="vote-grp flex gap-1 bg-stone-800 rounded-full px-2 md:hidden">
            <div className="flex gap-1 items-center p-2">
              <button className="rounded-full">
                <i className="bi bi-hand-thumbs-up hover:text-red-600"></i>
              </button>
              <span className="text-xs">133</span>
            </div>
            <div className="flex gap-1 items-center p-2">
              <button className="rounded-full">
                <i className="bi bi-hand-thumbs-down hover:text-red-600"></i>
              </button>
              <span className="text-xs">133</span>
            </div>
          </div>
          <div className="flex gap-1 items-center p-2 bg-stone-800 rounded-full px-4">
            <button className="rounded-full">
              <i className="bi bi-chat-square hover:text-red-600"></i>
            </button>
            <span className="text-xs">133</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
