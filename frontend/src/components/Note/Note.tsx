import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import "./note.scss";
import MenuBar from "./components/menuBar/MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Navbar from "./components/navBar/NavBar.tsx";
import Placeholder from "@tiptap/extension-placeholder";

export default function Note() {
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="notePage">
      <Navbar editor={editor} />
      <MenuBar editor={editor} />
      <div className="editor">
        <EditorContent
          editor={editor}
          className={isDropdownOpen ? "input-disabled" : ""}
        />
      </div>
    </div>
  );
}
