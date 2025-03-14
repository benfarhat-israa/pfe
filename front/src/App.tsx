import { useRoutes } from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";
import ArticleForm from "./Component/ArticleForm"; 
import CategoriesForm from "./Component/CategoriesForm"; 
import GestionProduit from "./Component/GestionProduit";
import CmndEnAtt from "./Component/CmndEnAtt";

const AppRoutes = () => {
  return useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/home", element: <Home /> },
    {path : "/gestion-produit",element:<GestionProduit/>},
    {path : "/liste-commande",element:<CmndEnAtt/>},



  ]);
};

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AppRoutes />
    </div>
  );
};

export default App;
