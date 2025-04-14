import "./Error404.scss";
import logoImg from "../../assets/logo_main.png";
import { useNavigate } from "react-router-dom";

export default function Error404() {
  const navigate = useNavigate();
  return (
    <>
      <div className="error404">
        <img
          src={logoImg}
          alt="Noted Logo"
          className="logo"
          onClick={() => {navigate("/")}}
        />
        <h1>404 - Page Not Found</h1>
        <p>A keresett oldal nem létezik.</p>
      </div>
    </>
  );
}
