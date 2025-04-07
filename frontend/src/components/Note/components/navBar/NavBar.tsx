import React, { useEffect, useState } from "react";
import "./Navbar.scss"; // Import the CSS file
import { User } from "lucide-react";
import { Share2 } from "lucide-react";
import logoImg from "../logo_main.png";
import { useNavigate } from "react-router-dom";
import { Undo } from "lucide-react";
import { Redo } from "lucide-react";
import { Copy } from "lucide-react";
import { ClipboardPaste } from "lucide-react";
import { Scissors } from "lucide-react";
import { FileDown } from "lucide-react";
import { FileUp } from "lucide-react";
import { RefreshCcw } from "lucide-react";

import Mammoth from "mammoth";

import SearchOverlay from "./SearchOverlay/SearchOverlay";

export default function Navbar({
  editor,
  docName,
  noteId,
}: {
  editor: any;
  docName: string;
  noteId: string;
}) {
  if (!editor) {
    return null;
  }
  const token = localStorage.getItem("token");

  const getNote = async () => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/getNote/${noteId}`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          "x-access-token": token,
        }),
      });
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
         // Set the content of the editor with the fetched note
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  useEffect(() => {
    getNote();
  }, [noteId]);

  const [docTitle, setDocTitle] = useState("Névtelen Dokumentum");

  useEffect(() => {
    if (docName) {
      setDocTitle(docName);
    }
  }, [docName]);

  const [loading, setLoading] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const saveJSON = (filename: string) => {
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

  const loadFetchedJSONToEditor = (jsonData: any) => {
    try {
      editor.commands.setContent(jsonData);
    } catch (error) {
      console.error("Error loading JSON into editor:", error);
    }
  };

  useEffect(() => {
    const fetchAndLoadNote = async () => {
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/getNote/${noteId}`, {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
            "x-access-token": token,
          }),
        });
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
        } else {
          loadFetchedJSONToEditor(data);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchAndLoadNote();
  }, [noteId, token]);

  const saveDocx = async (filename: any) => {};

  const loadJSON = (event: any) => {
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

  const loadDocx = (file: any) => {
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

  function handleSave() {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("Lathatosag", "1");
        const jsonContent = editor.getJSON();
        const blob = new Blob([JSON.stringify(jsonContent, null, 2)], {
          type: "application/json",
        });
        formData.append("file", blob, docTitle);

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated fetch
        if (token && token != null)
          await fetch("http://localhost:3000/CreateNote", {
            method: "POST",
            headers: new Headers({
              Accept: "application/json",
              "x-access-token": token,
            }),
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => console.log(data));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }

  return (
    <>
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
      <nav className="navbar-top">
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
        </div>
        <div className="navbar-center">
          <input
            type="text"
            className="doc-title"
            placeholder="Dokumentum Neve"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
        </div>
        <div className="navbar-right">
          <div className="profile-btn">
            <span onClick={handleProfile}>
              <User />
            </span>
          </div>
        </div>
      </nav>
      <nav className="navbar-bottom">
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
              if (e.target.files && e.target.files[0] != null) {
                const file = e.target.files[0];
                if (file) {
                  loadDocx(file);
                }
              }
            }}
            style={{ display: "none" }}
            id="fileUploadDocx"
          />
          <span onClick={handleSave}>
            <RefreshCcw className={loading ? "spinner" : ""} />
          </span>
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
          <span className="icon" onClick={() => setIsSearchVisible(true)}>
            <Share2 />
          </span>
        </div>
      </nav>
    </>
  );
}
