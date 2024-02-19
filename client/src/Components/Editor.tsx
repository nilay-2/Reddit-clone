import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "./MenuBar";
import Placeholder from "@tiptap/extension-placeholder";
import TextareaAutosize from "react-textarea-autosize";
import { RootState, AppDispatch } from "../app/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toastOpts } from "../app/reducers/authReducer";
import { devBackendUrl, prodBackendUrl } from "../utils/appUrl";

interface PostData {
  createdAt: number;
  authorId: string;
  title: string;
  textBody: string;
  htmlBody: string;
}

const defaultContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

const extensions = [
  StarterKit,
  Image,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Write something …",
  }),
];

const Editor: React.FC = () => {
  const editor = useEditor({
    extensions,
    content: defaultContent,
  })!;

  // redux state
  const authState = useSelector((state: RootState) => state.auth);

  // title state
  const [title, setTitle] = useState<string>("");

  const textAreaOnChangeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    setTitle(e.target.value);
  };

  const isTitleEmpty = (): string => {
    if (!title) {
      return "bg-stone-700";
    }
    return "bg-stone-500 hover:bg-stone-300 active:bg-stone-500";
  };

  const submitHanlder = async () => {
    if (!title) return;

    // get the html and text bodies from the editor
    const htmlBody = editor.getHTML();
    const textBody = editor.getText();
    const createdAt = Date.now();

    const postData: PostData = {
      createdAt: createdAt,
      authorId: authState.id,
      title: title,
      htmlBody: htmlBody,
      textBody: textBody,
    };

    await submitPostData(postData);
    clearInputs(defaultContent);
  };

  const clearInputs = (content: any) => {
    setTitle("");
    editor.chain().setContent(content).run();
  };

  const submitPostData = async (postData: PostData) => {
    try {
      const url =
        process.env.NODE_ENV === "production" ? prodBackendUrl : devBackendUrl;
      const res = await fetch(`${url}/api/posts/createpost`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const jsonRes = await res.json();
      console.log(jsonRes);
      if (jsonRes.error) {
        toast.error(jsonRes.message, toastOpts);
      } else {
        toast.success(jsonRes.message, toastOpts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {editor ? (
        <div>
          <div className="text-white border border-stone-400 rounded-md">
            <div className="p-2 flex">
              <TextareaAutosize
                value={title}
                minRows={1}
                className="w-full p-2 outline outline-stone-400 outline-1"
                style={{ backgroundColor: "#242425" }}
                placeholder="Title"
                onChange={textAreaOnChangeHandler}
              />
            </div>
            <MenuBar editor={editor} />
            <EditorContent
              editor={editor}
              onClick={() => {
                editor.commands.focus();
              }}
            />
          </div>
          <div className="submit-btn flex justify-end mt-5">
            <button
              className={`px-5 py-1 rounded-full text-sm font-bold ${isTitleEmpty()}`}
              disabled={title ? false : true}
              onClick={submitHanlder}
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        "Editor is loading...."
      )}
    </>
  );
};

export default Editor;
