import { useRoutes } from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";

const AppRoutes = () => {
  return useRoutes([
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
  ]);
};

const App = () => {
  return <AppRoutes />; // Ok car englobé dans <BrowserRouter> dans index.tsx
};

export default App;
