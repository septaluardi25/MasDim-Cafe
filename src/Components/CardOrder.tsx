import type { Menu } from "../types/Menu";
import type { OrderResponse } from "../types/Orders";

type CardOrderProps = {
  item: OrderResponse;
  menus: Menu[];

  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

const CardOrder = ({
  isDeleting,
  isUpdating,
  menus,
  item,
  onUpdate,
  onDelete,
}: CardOrderProps) => {
  return (
    <div className="w-full mx-auto">
      <div className="bg-gray-50 w-full p-5 rounded-xl shadow-xl flex justify-between flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-amber-950 text-2xl font-bold ">
            {item.table_number} - {item.customer_name}
          </h1>
          <button
            type="button"
            className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded-md cursor-pointer font-light"
            onClick={() => {
              if (window.confirm(`Hapus pesanan meja ${item.table_number}?`))
                onDelete(item.id);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting.." : "Delete"}
          </button>
        </div>
        <p className="text-sm font-light mb-5">
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="flex justify-between items-center">
          <div>
            {item.cart?.map((i, index) => {
              const menu = menus.find((menu) => menu.id === i.menuItemId);
              return (
                <div key={index}>
                  <div className="flex gap-5">
                    <div className="italic text-gray-700">{menu?.name}</div>
                    <div className=" text-gray-700">{i.quantity}</div>
                    <div className=" text-gray-700">{i.notes}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className={`border-2 border-amber-800 text-amber-800 px-2 py-1 rounded-md hover:bg-amber-800 hover:text-white font-semibold cursor-pointer self-end ${item.status === "COMPLETED" ? "bg-amber-800 text-white" : "bg-white"}`}
            onClick={() => onUpdate(item.id)}
            disabled={isUpdating || item.status === "COMPLETED"}
            type="button"
          >
            {isUpdating ? "Completing..." : item.status}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardOrder;
