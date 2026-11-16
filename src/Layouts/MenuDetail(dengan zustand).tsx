import { useQuery } from "@tanstack/react-query";
import { getMenuDetail } from "../api/menuApi";
import { useMenuDetailStore } from "../stores/menuDetailStore";

const MenuDetailZ = () => {
  const selectedMenuId = useMenuDetailStore((state) => state.selectedMenuId);
  const isOpen = useMenuDetailStore((state) => state.isOpen);
  const closeMenu = useMenuDetailStore((state) => state.closeMenu);

  const { data, isPending } = useQuery({
    queryKey: ["menu-detail", selectedMenuId],
    queryFn: () => getMenuDetail(selectedMenuId!),
    enabled: !!selectedMenuId && isOpen,
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center ">
      <div className="relative min-w-md bg-gray-100  max-h-screen rounded-2xl grid-rows-1 sm:grid-cols-2">
        <button
          onClick={closeMenu}
          type="button"
          className="bg-amber-800 text-gray-100 hover:bg-amber-900 rounded-full px-3 py-1 font-semibold absolute  -right-3 -top-3 z-10 cursor-pointer trasnsition duration-200"
        >
          x
        </button>
        <div>
          <img
            src={data?.menuItem.image_url}
            className="max-h-96 w-full object-cover p-5 rounded-xl"
          />
          <div className="px-5">
            <h1 className="text-amber-900 text-3xl font-bold">
              {data?.menuItem.name}
            </h1>
            <p className="text-gray-900 text-light">
              {data?.menuItem.description}
            </p>
            <p>
              {data?.menuItem.price}
              {!isPending && <span>$</span>}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 gap-3">
          <button className="bg-amber-950 text-gray-100 px-4 py-1 rounded-lg font-semibold">
            Check Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailZ;
