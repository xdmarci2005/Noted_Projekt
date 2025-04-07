import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
import "./note.scss";
import MenuBar from "./components/menuBar/MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Navbar from "./components/navBar/NavBar";
import Placeholder from "@tiptap/extension-placeholder";
import { useLocation } from "react-router-dom";

export default function Note() {
  const location = useLocation();
  const noteId = location.state?.id;

  const [noteName, setNoteName] = useState("");

  

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Írjon valamit...",
      }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
  });

  return (
    <div className="notePage">
      <Navbar editor={editor} docName={noteName} noteId={noteId}/>
      <MenuBar editor={editor} />
      <div className="editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
