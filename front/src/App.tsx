import { useRoutes } from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";
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
        <AppRoutes />
  );
};

export default App;
