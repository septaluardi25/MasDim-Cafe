import { useNavigate } from "react-router";

const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="bg-amber-900 text-gray-200 rounded-md py-2 px-4 font-bold cursor-pointer hover:bg-gray-300 transition duration-200"
      type="button"
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  );
};

export default LoginButton;
