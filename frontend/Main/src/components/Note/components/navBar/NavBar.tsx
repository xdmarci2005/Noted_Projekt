import React, { useState, useEffect } from "react";
import "./Navbar.scss"; // Import the CSS file
import { FaUser, FaShareAlt } from "react-icons/fa";
import logoImg from "../logo_main.png";
import { useNavigate } from "react-router-dom";
import { Undo } from "lucide-react";
import { Redo } from "lucide-react";
import { Copy } from "lucide-react";
import { ClipboardPaste } from "lucide-react";
import { Scissors } from "lucide-react";
import { FileDown } from "lucide-react";
import { FileUp } from "lucide-react";
import Mammoth from "mammoth";
import { saveAs } from "file-saver";
import ConvertApi from "convertapi-js";









export default function Navbar({ editor }) {
  if (!editor) {
    return null;
  }

  const [docTitle, setDocTitle] = useState("Névtelen Dokumentum");

  const saveJSON = (filename) => {
    const jsonContent = editor.getJSON();

    // JSON fájlba mentés
    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const saveDocx = async (filename) => {
     
     let convertApi = ConvertApi.auth("ITT LENNE A SAJÁT TOKENUNK HA ELŐFIZETNÉNK"); //csak itt van a problem
     let params = convertApi.createParams();
     params.add("File", editor.getHTML());
     let result = await convertApi.convert("html", "docx", params);
  };

  

  const loadJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target && typeof e.target.result === "string") {
          const jsonData = JSON.parse(e.target.result);
          editor.commands.setContent(jsonData);
        }
      } catch (error) {
        console.error("Hiba a JSON fájl betöltésekor:", error);
      }
    };

    reader.readAsText(file);
  };

  const loadDocx = (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
            
            const arrayBuffer = event.target?.result; // Correctly get the arrayBuffer

            if (arrayBuffer instanceof ArrayBuffer) {
              // Convert the arrayBuffer to HTML using Mammoth
              const result = await Mammoth.convertToHtml({ arrayBuffer });

              const htmlContent = result.value; // This will contain the HTML content

              // Now, set the HTML content into Tiptap
              editor.commands.setContent(htmlContent);
            }
            
      } catch (err) {
        console.error("Error converting DOCX:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  
  

  const navigate = useNavigate();

  function handleOpen() {}

  function handleProfile() {
    navigate("/profile");
  }

  

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="icon">
            <img
              src={logoImg}
              alt="Noted Logo"
              className="logo"
              onClick={() => {
                navigate("/home");
              }}
            />
          </span>
          <input
            type="text"
            className="doc-title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
        </div>

        <div className="navbar-center">
          <input
            type="file"
            accept="application/json"
            onChange={loadJSON}
            style={{ display: "none" }}
            id="fileUploadJSON"
          />
          <input
            type="file"
            accept=".docx"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                loadDocx(file);
              }
            }}
            style={{ display: "none" }}
            id="fileUploadDocx"
          />
          <div className="save-upload">
            <FileUp />
            <span
              onClick={() => document.getElementById("fileUploadJSON")?.click()}
            >
              JSON
            </span>
            <div>/</div>
            <span
              onClick={() => document.getElementById("fileUploadDocx")?.click()}
            >
              docx
            </span>
          </div>
          <div className="save-upload">
            <FileDown />
            <span
              onClick={() => {
                saveJSON(docTitle);
              }}
            >
              JSON
            </span>
            <div>/</div>
            <span
              onClick={() => {
                saveDocx(docTitle);
              }}
            >
              docx
            </span>
          </div>
          <span>
            <Undo />
          </span>
          <span>
            <Redo />
          </span>
          <span>
            <Copy />
          </span>
          <span>
            {" "}
            <Scissors />
          </span>
          <span>
            <ClipboardPaste />
          </span>
        </div>

        <div className="navbar-right">
          <button className="btn share-btn">
            <span className="icon">
              <FaShareAlt />
            </span>{" "}
            Share
          </button>
          <button className="btn profile-btn" onClick={handleProfile}>
            <span className="icon">
              <FaUser />
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
