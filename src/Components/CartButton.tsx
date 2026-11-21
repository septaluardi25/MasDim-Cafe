import { useNavigate } from "react-router";
import { useCartStore } from "../stores/cartStore";

const CartButton = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItem());

  return (
    <button
      className="bg-gray-100 hover:bg-amber-900 px-4 py-2 rounded-md border-2 border-amber-900 text-amber-900 hover:text-gray-100 font-bold cursor-pointer transition duration-200"
      onClick={() => navigate("/cart")}
    >
      🛒 Cart {totalItems}
    </button>
  );
};

export default CartButton;
