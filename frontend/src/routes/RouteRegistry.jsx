import AdminDashboard from "../components/AdminDashboard";
import AuthModal from "../components/AuthModal";
import Cart from "../components/Cart";
import Products from "../components/Products";
import MyOrders from "../components/MyOrders";

export const routeComponents = {
    "/adminDashboard": AdminDashboard,
    "/cart": Cart,
    "/products": Products,
    "/login": AuthModal,
    "/my-orders": MyOrders

}