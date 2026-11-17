import { useAuthStore } from "../stores/authStore";

const LogoutButton = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };
  if (!user) return null;
  return (
    <div className="flex  gap-4 items-center">
      <div className="text-amber-900 font-semibold  text-xs sm:text-sm max-w-25]">
        Hello {user.name}{" "}
      </div>
      <button
        className="bg-amber-900 text-gray-200 rounded-md py-2 px-4 font-bold cursor-pointer hover:bg-gray-300 transition duration-200"
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
