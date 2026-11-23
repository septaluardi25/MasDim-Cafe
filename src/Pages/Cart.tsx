import { Link, useNavigate } from "react-router";
import Header from "../Components/Header";
import { useCartStore } from "../stores/cartStore";
import React, { useState } from "react";
import type { OrderPayload } from "../types/Orders";
import { useMutation } from "@tanstack/react-query";
import { postOrder } from "../api/OrdersApi";
import { toast } from "react-toastify";

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.getTotalPrice());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState<number | "">("");

  const orderMutation = useMutation({
    mutationFn: (payload: OrderPayload) => postOrder(payload),
    onSuccess: () => {
      toast.success("pesanan berhasil dikirim");
      clearCart();
      setCustomerName("");
      setTableNumber("");
      setNotes({});
      navigate("/menu");
    },
    onError: (err: Error) => {
      toast.error(err.message || "gagal membuat pesanan");
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!customerName.trim() || !tableNumber) {
      toast.warning("harap isi customer order");
      return;
    }

    const payload: OrderPayload = {
      customerName: customerName.trim(),
      tableNumber: Number(tableNumber),
      cart: items.map((item) => ({
        menuItemId: String(item.id),
        quantity: item.quantity,
        notes: notes[String(item.id)] || "",
      })),
    };
    orderMutation.mutate(payload);
    console.log(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-48 md:w-16 md:h-16 object-cover rounded "
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-amber-950 min-w-20">
                      {item.name}
                    </h2>
                    <p className="text-amber-800 font-bold">${item.price}</p>
                  </div>
                  <div className="flex flex-col  gap-3 ">
                    <input
                      type="text"
                      placeholder="Note ..."
                      className="rounded-md py-1 px-2 w-full text-sm focus:outline-none focus:ring focus:ring-amber-800"
                      value={notes[String(item.id)] || ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [String(item.id)]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex items-center justify-between gap-4 pt-2 border-t  border-gray-100">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 text-sm hover:underline w-full md:w-15"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {/* FORM */}
            <form
              className="mt-6 md:mt-0 bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col justify-between w-full g-4">
                <h1 className="items-center mx-auto font-bold text-3xl uppercase text-amber-950">
                  Order Form
                </h1>
                <label
                  htmlFor="customerName"
                  className="font-semibold"
                >
                  Name :
                </label>
                <input
                  id="customerName"
                  className="py-1 px-2 rounded-md focus:ring border border-amber-800 focus:ring-amber-800 focus:outline-none text-amber-950 font-semibold"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="masukan nama..."
                />
                <label
                  htmlFor="tableNumber"
                  className="font-semibold text-amber-950"
                >
                  Table Number :
                </label>
                <input
                  id="tableNumber"
                  className="py-1 px-2 rounded-md focus:ring border border-amber-800 focus:ring-amber-800 focus:outline-none text-amber-950 font-semibold"
                  min={1}
                  onChange={(e) =>
                    setTableNumber(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  placeholder="masukan nomor meja..."
                  type="number"
                />
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-amber-800">
                  ${totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="mt-4 flex justify-between w-full">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:underline"
                  type="button"
                >
                  Kosongkan cart
                </button>
                <button
                  className="bg-amber-950 text-white px-4 py-2 rounded-lg hover:bg-amber-900"
                  type="submit"
                  disabled={orderMutation.isPending}
                >
                  {orderMutation.isPending ? "Sending..." : "Checkout →"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
