import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import "./note.scss";
import MenuBar from "./components/menuBar/MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Navbar from "./components/navBar/NavBar";



export default function Note() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
    ],
    content: "<p>Itt elkezdheti a jegyzetét</p>",
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
  });

  return (
    <div className="notePage">
      <Navbar />
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
