import { useNavigate } from "react-router";
import coffee from "../assets/coffee.png";
import { useAuthStore } from "../stores/authStore";

const Main = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const navigate = useNavigate();
  const handleOrder = () => {
    !isLogin ? navigate("/login") : navigate("/menu");
  };

  return (
    <div className="  flex  items-center justify-center   min-h-[calc(100vh-5rem)] py-8 px-4 w-full">
      <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2">
        <div className="p-5">
          <p className="text-amber-800 font-semibold mb-5">
            Locally-Owned Coffee Shop Serving Cleveland
          </p>
          <p className="text-4xl font-serif text-amber-950 mb-5">
            Brewing Hope & Great Coffee in the heart of Buckeye
          </p>
          <p className="text-amber-950 font-light mb-5">
            Once a bar, now a beacon of ambition —
            <span className="font-bold">The Tavern Coffee House </span> is a
            unique & ecclectic café revitalizing the Buckeye-Shaker neighborhood
            through <span className="font-bold">community, careers, </span> and
            <span className="font-bold">coffee.</span>
          </p>
          <p className="text-amber-950 font-bold mb-5">
            Open 8am – 1pm Monday-Friday
          </p>
          <div className="flex justify-start md:gap-5">
            <button
              className="bg-gray-100 px-4 py-2 border-2  border-amber-950 text-amber-950 font-semibold hover:bg-amber-950 hover:text-gray-100 transition duration-200 cursor-pointer"
              onClick={handleOrder}
            >
              Order Ahead &rarr;
            </button>
            <button
              className="bg-amber-950 px-4 py-2 border-2  border-amber-950 text-gray-100 font-semibold hover:bg-gray-100 hover:text-amber-950 transition duration-200 cursor-pointer"
              onClick={() => navigate("/menu")}
            >
              Our Menu &rarr;
            </button>
          </div>
        </div>
        <img
          className="self-center "
          src={coffee}
          alt="coffee"
        />
      </div>
    </div>
  );
};

export default Main;
