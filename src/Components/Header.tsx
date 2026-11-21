import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import logo from "../assets/masdim logo.png";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);

  return (
    <div className="bg-white h-16 sm:h-20 w-full shadow-md flex justify-between items-center p-5 mb-5 ">
      <img
        src={logo}
        alt="MasDim Cafe"
        className="w-24 sm:w-28 hover:cursor-pointer "
        onClick={() => navigate("/")}
      />

      {!isLogin ? <LoginButton /> : <LogoutButton />}
    </div>
  );
};

export default Header;
