import CardMenus from "../Components/CardMenus";
import Header from "../Components/Header";
import { useQuery } from "@tanstack/react-query";
import { getMenus } from "../api/menuApi";
import { useEffect, useState } from "react";
import CartButton from "../Components/CartButton";
import MenuGridSkeleton from "../Components/SkeletonLoadingMenus";

const Menus = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const itemPage = 6;

  const {
    data = [],
    isError,
    isPending,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });

  // buat list categoryies
  const categories = [
    "All",
    ...new Set(data?.map((item) => item.category) ?? []),
  ];

  // buat search
  const filteredMenus = data?.filter((item) => {
    const keyword = search.toLowerCase().trim();
    const matchSearch =
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const matchCategories =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchCategories && matchSearch;
  });

  // page
  const pageSize = Math.ceil(filteredMenus.length / itemPage);
  const startIndex = (page - 1) * itemPage;
  const endIndex = page * itemPage;
  const currentMenus = filteredMenus.slice(startIndex, endIndex);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  if (isError) return <p>Error...</p>;

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-950 mb-6">Our Menu</h1>
          <CartButton />
        </div>
        <input
          className="w-full bg-white px-4 py-2 rounded-2xl mb-5 mt-5 border-2 border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Find menu.."
        />
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
                  onClick={() => {
                    setSelectedCategory(c);
                    setPage(1);
                  }}
                  className={`text-left px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${selectedCategory === c ? "bg-amber-950 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </aside>

          {/* grid menu */}
          {isPending ? (
            <MenuGridSkeleton />
          ) : currentMenus?.length === 0 ? (
            <p className="flex justify-center items-center">
              Tidak ada menu untuk Category {selectedCategory}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {currentMenus?.map((menu) => (
                <CardMenus
                  key={menu.id}
                  menu={menu}
                />
              ))}
            </div>
          )}
        </div>

        {/* pagination */}
        {pageSize > 1 && (
          <div className="flex gap-2 justify-center items-center mt-5">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="border-2 border-amber-800 px-2 py-1 rounded-xl cursor-pointer font-semibold text-amber-800 hover:bg-amber-800 hover:text-gray-100 transition-all duration-100    disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: pageSize }).map((_, index) => {
              const currentPage = index + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={index}
                  className={`border-2 border-amber-800 px-2 py-1 rounded-xl cursor-pointer font-semibold  hover:bg-amber-800 hover:text-gray-100 transition-all duration-100 ${isActive ? "bg-amber-800 text-gray-100" : "text-amber-800 "}`}
                  onClick={() => setPage(index + 1)}
                >
                  {currentPage}
                </button>
              );
            })}
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === pageSize}
              className="border-2 border-amber-800 px-2 py-1 rounded-xl cursor-pointer font-semibold text-amber-800 hover:bg-amber-800 hover:text-gray-100 transition-all duration-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menus;
