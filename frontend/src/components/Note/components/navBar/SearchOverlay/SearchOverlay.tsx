import { useEffect, useState } from "react";
import "./SearchOverlay.scss";
import { Search } from "lucide-react";
import { Plus } from "lucide-react";
import CustomModal from "../../Modal/Modal";

export default function SearchOverlay({
  visible,
  setVisible,
  onClose,
  noteId,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  noteId: string;
}) {
  if (!visible) return null;

  const [isResults, setIsResults] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [already, setAlready] = useState<boolean>(false);
  const [activeOption, setActiveOption] = useState(true);
  const [notFoundContent, setNotFoundContent] =
    useState<string>("Nincs találat");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<any>();
  const [permission, setPermission] = useState("R");

  async function handleAddtoGroup(groupId: any) {
    if (token)
      await fetch("http://localhost:3000/newShare", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
        body: JSON.stringify({
          JegyzetId: noteId,
          MegosztottFelhId: null,
          MegosztottCsopId: groupId,
          Jogosultsag: permission,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            handleModalOpen({ message: data.success });
          } else {
            handleModalOpen({ message: data.error });
          }
        });
  }

  function handleModalClose() {
    setShowModal(false);
    setVisible(false);
  }
  function handleModalOpen({ message }: { message: string }) {
    setModalMessage(message);
    setShowModal(true);
  }

  const token = localStorage.getItem("token");

  const handleAdd = ({ userId }: { userId: any }) => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    } else
      fetch("http://localhost:3000/newShare", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
        body: JSON.stringify({
          JegyzetId: noteId,
          MegosztottFelhId: userId,
          MegosztottCsopId: null,
          Jogosultsag: permission,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            handleModalOpen({ message: data.success });
          } else {
            handleModalOpen({ message: data.error });
          }
        });
  };

  const setCsoportActive = async () => {
    setNotFoundContent("Nincs találat");
    if (!token) {
      console.error("Token not found in localStorage");

      return;
    } else
      await fetch("http://localhost:3000/GetOwnedGroups", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setIsResults(true);
            setResults(data.data);
            console.log(data.data);
            console.log(data);
          } else {
            setIsResults(false);
            setNotFoundContent(data.error);
          }
        });
    setActiveOption(false);
  };

  const setMemberActive = () => {
    setNotFoundContent("Nincs találat");
    setIsResults(false);
    setResults([]);
    setActiveOption(true);
  };

  const handleSearch = async () => {
    const searchTerm = (
      document.getElementById("search-field") as HTMLInputElement
    ).value;

    setAlready(true);

    const token = localStorage.getItem("token");

    if (activeOption) {
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      } else
        await fetch(`http://localhost:3000/getUserByName/${searchTerm}`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": token,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log(data.data);
              setResults(data.data);
              setIsResults(true);
            } else if (data.error) {
              setIsResults(false);
              setNotFoundContent(data.error);
            }
          });
    } else {
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      } else
        fetch(`http://localhost:3000/getGroupByName/${searchTerm}`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-access-token": token,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.data.length > 0) {
              setResults(data.data);
              console.log(data.data);
              setIsResults(true);
            } else {
              setIsResults(false);
            }
          });
    }
  };

  return (
    <>
      <CustomModal
        show={showModal}
        title="Noted."
        message={modalMessage}
        onClose={() => handleModalClose()}
      />

      <div className="overlay">
        <div className="search-box">
          <h2>Megosztás</h2>
          <div>
            <span className="shareOptions">
              <span
                className={activeOption ? "active-span" : "inactive-span"}
                onClick={() => setMemberActive()}
              >
                Emberrel
              </span>
              <span
                className={activeOption ? "inactive-span" : "active-span"}
                onClick={() => setCsoportActive()}
              >
                Csoportal
              </span>
            </span>
            <span className="shareOptions">
              <span
                className={
                  permission == "R" ? "active-span" : "inactive-span"
                }
                onClick={() => setPermission("R")}
              >
                Olvasó
              </span>
              <span
                className={
                  permission == "RW" ? "active-span" : "inactive-span"
                }
                onClick={() => setPermission("RW")}
              >
                Szerkeztő
              </span>
              <span
                className={
                  permission == "RWS" ? "active-span" : "inactive-span"
                }
                onClick={() => setPermission("RWS")}
              >
                Moderátor
              </span>
            </span>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Keresés"
              id="search-field"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Search className="icon" onClick={handleSearch} />
          </div>
          {isResults && activeOption && (
            <div className="results-list">
              {results.map((result) => (
                <div key={result.FelhasznaloId}>
                  <table>
                    <tbody>
                      <tr className="result-item">
                        <td>{result.FelhasznaloNev}</td>
                        <td>
                          <button
                            className="add-button"
                            onClick={() =>
                              handleAdd({ userId: result.FelhasznaloId })
                            }
                          >
                            <Plus />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {isResults && !activeOption && (
            <div className="results-list">
              {results.map((result) => (
                <div key={result.CsoportId}>
                  <table>
                    <tbody>
                      <tr className="result-item">
                        <td>{result.CsoportNev}</td>
                        <td>
                          <button
                            className="add-button"
                            onClick={() => handleAddtoGroup(result.CsoportId)}
                          >
                            <Plus />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {!isResults && already && (
            <h3 className="no-results">{notFoundContent}</h3>
          )}
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
