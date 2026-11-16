import { useMenuDetailStore } from "../stores/menuDetailStore";
import type { Menu } from "../types/Menu";

type Props = {
  menu: Menu;
};
const CardMenusZ = ({ menu }: Props) => {
  const openMenu = useMenuDetailStore((state) => state.openMenu);
  return (
    <div
      className="bg-gray-100 rounded-xl flex flex-col"
      onClick={() => openMenu(menu.id)}
    >
      <img
        className="h-40 w-full object-cover rounded-xl self-center p-4"
        src={menu.image_url}
        alt={menu.name}
      />
      <div className="p-4">
        <h1 className="text-amber-950 text-xl font-bold">{menu.name}</h1>
        <p className="text-amber-900 font-light text-sm space-x-0 line-clamp-2">
          {menu.description}
        </p>
        <div className="flex justify-between items-center mt-5">
          <span className="text-md font-semibold text-amber-800">
            {menu.price} $
          </span>
          <button className="bg-amber-950 text-gray-100 px-4 py-1 rounded-xl hover:bg-amber-900 transition duration-200 cursor-pointer">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardMenusZ;
