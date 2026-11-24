import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../api/OrdersApi";
import Header from "../Components/Header";
import CardOrder from "../Components/CardOrder";
import { getMenus } from "../api/menuApi";
import { useState } from "react";

const Orders = () => {
  const [sortOrders, setSortOrders] = useState<"asc" | "desc">("asc");
  // getmenus
  const { data: menus = [] } = useQuery({
    queryKey: [`menus`],
    queryFn: getMenus,
  });
  const {
    data = [],
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: [`orders`],
    queryFn: getOrder,
  });

  const sortedOrders = [...data].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();

    return sortOrders === "asc" ? timeA - timeB : timeB - timeA;
  });
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-gray-100 ">
      <Header />
      <main className="container mx-auto px-5">
        <div className="flex justify-between items-center ">
          <h1 className="text-amber-950 text-5xl font-bold mb-5 mt-5 border-b border-gray-200 pb-5">
            Orders List
          </h1>
          <button
            className="border-2 border-amber-800 text-amber-800 px-2 py-1 rounded-md hover:bg-amber-800 hover:text-white font-semibold cursor-pointer"
            onClick={() =>
              setSortOrders((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrders === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
        <div className="flex flex-col gap-5">
          {sortedOrders.map((item) => (
            <CardOrder
              key={item.id}
              item={item}
              menus={menus}
              isPending={isPending}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;
