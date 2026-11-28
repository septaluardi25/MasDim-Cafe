import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteOrder, getOrder, putOrder } from "../api/ordersApi";
import Header from "../Components/Header";
import CardOrder from "../Components/CardOrder";
import { getMenus } from "../api/menuApi";
import { useState } from "react";
import { toast } from "react-toastify";
import queryClient from "../lib/queryClient";
import OrderGridSkeleton from "../Components/SkeletonLoadingOrders";

const Orders = () => {
  const [sortOrders, setSortOrders] = useState<"asc" | "desc">("asc");

  // get menus
  const { data: menus = [] } = useQuery({
    queryKey: [`menus`],
    queryFn: getMenus,
  });

  //post menus
  const {
    data = [],
    isError,
    error,
    isPending,
  } = useQuery({
    queryKey: [`orders`],
    queryFn: getOrder,
  });

  // put menus
  const putMutation = useMutation({
    mutationFn: putOrder,
    onSuccess: () => {
      toast.success("Pesanan telah diselesaikan");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  //delete menus
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      toast.success("Berhasil menghapus pesanan");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const sortedOrders = [...data].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();

    return sortOrders === "asc" ? timeA - timeB : timeB - timeA;
  });

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-gray-100 ">
      <Header />
      <div className="container mx-auto px-5 flex-col sm:flex-row flex sm:justify-between items-start sm:items-center mb-5 w-full  border-b border-gray-200 mt-5 pb-5 gap-4">
        <h1 className="text-amber-950 text-5xl font-bold">Orders List</h1>

        <button
          className="self-start sm:self-auto border-2 border-amber-800 text-amber-800 px-2 py-1 rounded-md hover:bg-amber-800 hover:text-white font-semibold cursor-pointer "
          onClick={() =>
            setSortOrders((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          disabled={isPending}
        >
          {sortOrders === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      {isPending ? (
        <OrderGridSkeleton />
      ) : (
        <main className="container mx-auto px-5">
          <div className="flex flex-col gap-5">
            {sortedOrders.map((item) => (
              <CardOrder
                key={item.id}
                item={item}
                menus={menus}
                isUpdating={
                  putMutation.isPending && putMutation.variables?.id === item.id
                }
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === item.id
                }
                onUpdate={(id) =>
                  putMutation.mutate({ id, status: "COMPLETED" })
                }
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default Orders;
