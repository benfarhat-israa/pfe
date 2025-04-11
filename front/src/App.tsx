import { useRoutes } from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";
import GestionProduit from "./Component/GestionProduit";
import CmndEnAtt from "./Component/CmndEnAtt";
import CategoriesForm from "./Component/CategoriesForm";
import Produits from "./Component/Produits";

const AppRoutes = () => {
  return useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/gestion-produit", element: <GestionProduit /> },
    { path: "/liste-commande", element: <CmndEnAtt /> },


    { path: "/ajouter-categorie", element: <CategoriesForm /> },
    { path: "/produits", element: <Produits /> },

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
