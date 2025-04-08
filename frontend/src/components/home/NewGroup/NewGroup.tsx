import "./NewGroup.scss";
import { X } from "lucide-react";


export default function NewGroup({ visible, onCreate, onClose }: { visible: boolean, onClose: () => void, onCreate: () => void }) {
  if (!visible) return null;

    

  return (
    <>
      
      <div className="new-group">
        <div className="overlay">
          <div className="search-box">
            <span onClick={onClose} className="close">
              <X size={32} />
            </span>
            <h1>Új Csoport</h1>
            <div className="search-container">
              <input type="text" placeholder="Csoport Neve" id="group-field" />
            </div>

            <button className="create-btn" onClick={onCreate}>
              Létrehozás
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
