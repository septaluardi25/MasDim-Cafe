import CardMenus from "../Components/CardMenus";
import Header from "../Components/Header";
import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../api/menuApi";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "../stores/cartStore";

const Menus = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { data, isError, isPending } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  const totalItems = useCartStore((state) => state.getTotalItem());

  const categories = ["All", ...new Set(data?.map((m) => m.category))];
  const filteredMenus =
    selectedCategory === "All"
      ? data
      : data?.filter((m) => m.category === selectedCategory);

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-950 mb-6">Our Menu</h1>
          <button
            className="bg-gray-100 hover:bg-amber-900 px-4 py-2 rounded-md border-2 border-amber-900 text-amber-900 hover:text-gray-100 font-bold cursor-pointer transition duration-200"
            onClick={() => navigate("/cart")}
          >
            🛒 Cart {totalItems}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* category filter */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">
              Kategori
            </h2>
            <div className="flex flex-row flex-wrap justify-center lg:flex-col gap-2  lg:overflow-visible">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`text-left px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${selectedCategory === c ? "bg-amber-950 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </aside>

          {/* grid menu */}
          {filteredMenus?.length === 0 ? (
            <p>Tidak ada menu untuk Category {selectedCategory}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredMenus?.map((menu) => (
                <CardMenus
                  key={menu.id}
                  menu={menu}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menus;
