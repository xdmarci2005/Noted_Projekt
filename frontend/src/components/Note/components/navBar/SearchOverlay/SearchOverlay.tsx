import { useEffect, useState } from "react";
import "./SearchOverlay.scss";
import { Search } from "lucide-react";
import { Plus } from "lucide-react";

export default function SearchOverlay({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  const [isResults, setIsResults] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [already, setAlready] = useState<boolean>(false);

  const handleAdd = ({ userId }: { userId: number }) => {
    const token = localStorage.getItem("token");
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
          JegyzetId: 1,
          MegosztottFelhId: userId,
          MegosztottCsopId: 1,
          Jogosultsag: "R",
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
  };
  // Function to handle search logic (to be implemented)
  const handleSearch = () => {
    const searchTerm = (
      document.getElementById("search-field") as HTMLInputElement
    ).value;

    setAlready(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    } else
      fetch(`http://localhost:3000/getUserByName/${searchTerm}`, {
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
  };

  return (
    <>
      <div className="overlay">
        <div className="search-box">
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
                <div key={result.FelhasznaloId} className="result-item">
                  <p>
                    {result.FelhasznaloNev}{" "}
                    <button
                      className="add-button"
                      onClick={() => handleAdd(result.FelhasznaloId)}
                    >
                      <Plus />
                    </button>
                  </p>
                </div>
              ))}
            </div>
          )}
          {!isResults && already && (
            <div className="no-results">Nincs találat</div>
          )}

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
