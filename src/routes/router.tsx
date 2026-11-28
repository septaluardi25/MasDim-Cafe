import { createBrowserRouter } from "react-router";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import NotFound from "../Pages/NotFound";
import GuestRoute from "../Components/GuestRoute";
import Menus from "../Pages/Menus";
import MenuDetail from "../Layouts/MenuDetail";
import Cart from "../Pages/Cart";
import ProtectedRoute from "../Components/ProtectedRoute";
import Orders from "../Pages/Orders";
import Reviews from "../Pages/Reviews";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  { path: "/menu", element: <Menus /> },
  { path: "/menu/:id", element: <MenuDetail /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/cart", element: <Cart /> },
      { path: "/orders", element: <Orders /> },
      { path: "/reviews/:id", element: <Reviews /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
