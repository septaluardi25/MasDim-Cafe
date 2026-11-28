import { useQuery } from "@tanstack/react-query";
import { getMenuDetail } from "../api/menuApi";
import { Link, useNavigate, useParams } from "react-router";
import { useCartStore } from "../stores/cartStore";
import CartButton from "../Components/CartButton";

const MenuDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { data, isPending, isError } = useQuery({
    queryKey: ["menu-detail", id],
    queryFn: () => getMenuDetail(id!),
    enabled: !!id,
  });

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(menuItem);
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Gagal memuat menu</p>
      </div>
    );
  }

  if (!data) return null;

  const { menuItem, reviews } = data;
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* back button  dan cart button*/}
        <div className="flex justify-between items-center mb-5">
          <Link
            to="/menu"
            className="inline-block mb-6 text-amber-800 hover:underline "
          >
            Back to menu
          </Link>
          <CartButton />
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <img
              src={menuItem.image_url}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-amber-900 text-3xl font-bold">
                  {menuItem.name}
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {menuItem.category}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{menuItem.description}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-amber-500 text-lg">
                  {"⭐".repeat(Math.round(reviews.averageRating))}
                </span>
                <span className="text-sm text-gray-500">
                  {reviews.averageRating.toFixed(1)} ({reviews.total} ulasan)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Harga</p>
                  <p className="text-2xl font-bold text-amber-800">
                    ${menuItem.price}
                  </p>
                </div>
                <div className="flex gap-5">
                  <button
                    className={`border-2 border-amber-950 text-amber-950 font-semibold hover:text-gray-100 px-4 py-1 rounded-xl hover:bg-amber-950 transition duration-200 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/reviews/${menuItem.id}`, {
                        state: { menuName: menuItem.name },
                      });
                    }}
                  >
                    Review
                  </button>
                  <button
                    className="bg-amber-950 text-white px-6 py-2 rounded-lg hover:bg-amber-900 transition"
                    onClick={handleAdd}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* reviews */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-amber-950 mb-4">
              Ulasan ({reviews.total})
            </h2>
            {reviews.items.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada ulasan.</p>
            ) : (
              <div className="space-y-3 max-h-125 overflow-y-auto">
                {reviews.items.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-400"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-amber-950">
                        {review.reviewer_name}
                      </p>
                      <span className="text-amber-500 text-sm">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetail;
