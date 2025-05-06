import { useRoutes } from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";
import { CartProvider } from "./Component/CartContext";
import HomeSimple from "./Component/HomeSimple";
import Princibale from "./Component/Princibale";

const AppRoutes = () => {
  return useRoutes([
    { path: "/", element: <Princibale /> },
    { path: "/login", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/home-simple", element: <HomeSimple /> },

  ]);
};

const App = () => {
  return (
    <CartProvider >
        <AppRoutes />
    </CartProvider>
  );
};

export default App;
