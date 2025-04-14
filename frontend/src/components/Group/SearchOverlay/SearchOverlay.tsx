import { useEffect, useState } from "react";
import "./SearchOverlay.scss";
import { Search } from "lucide-react";
import { Plus } from "lucide-react";
import CustomModal from "../Modal/Modal";

export default function SearchOverlay({
  visible,
  onClose,
  groupId,
}: {
  visible: boolean;
  onClose: () => void;
  groupId: string;
}) {
  if (!visible) return null;

  const [isResults, setIsResults] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [already, setAlready] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<any>();
  const [notFoundContent, setNotFoundContent] = useState<string>("");
  const [activeOption, setActiveOption] = useState(true);

  function handleModalClose() {
    setShowModal(false);
  }
  function handleModalOpen({ message }: { message: string }) {
    setModalMessage(message);
    setShowModal(true);
  }

  const token = localStorage.getItem("token");

  const handleAdd = ({ userId }: { userId: number }) => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    } else
      fetch("http://localhost:3000/addMember", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
        body: JSON.stringify({
          CsoportId: groupId,
          TagId: userId,
          JogosultsagId: activeOption ? 1 : 2,
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

  const handleSearch = async () => {
    const searchTerm = (
      document.getElementById("search-field") as HTMLInputElement
    ).value;

    setAlready(true);

    const token = localStorage.getItem("token");

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
            setNotFoundContent(data.error);
            setIsResults(false);
          }
        });
  };

  return (
    <>
      <CustomModal
        onClose={handleModalClose}
        message={modalMessage}
        title="Noted."
        show={showModal}
      />
      <div className="overlay">
        <div className="search-box">
          <h3>Ember Hozzáadása</h3>
          <div className="permissions">
            <span
              className={activeOption ? "active-span" : "inactive-span"}
              onClick={() => setActiveOption(true)}
            >
              Néző
            </span>
            <span
              className={activeOption ? "inactive-span" : "active-span"}
              onClick={() => setActiveOption(false)}
            >
              Szerkeztő
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
          {isResults && (
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
