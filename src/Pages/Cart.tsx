import { Link } from "react-router";
import Header from "../Components/Header";
import { useCartStore } from "../stores/cartStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-amber-950 mb-6">Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Keranjang masih kosong</p>
            <Link
              to="/menu"
              className="bg-amber-950 text-white px-4 py-2 rounded-lg hover:bg-amber-900"
            >
              Lihat Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="sm:w-16 sm:h-16 object-cover rounded "
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-amber-950">
                      {item.name}
                    </h2>
                    <p className="text-amber-800 font-bold">${item.price}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-amber-800">
                ${totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={clearCart}
                className="text-red-600 hover:underline"
              >
                Kosongkan cart
              </button>
              <Link
                to="/checkout"
                className="bg-amber-950 text-white px-6 py-2 rounded-lg hover:bg-amber-900"
              >
                Checkout →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
