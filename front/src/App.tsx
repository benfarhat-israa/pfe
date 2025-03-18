import { useRoutes } from "react-router-dom";
import Login from "./Component/Login";
import Home from "./Component/Home";
import ArticleForm from "./Component/ArticleForm"; 
import CategoriesForm from "./Component/CategoriesForm"; 

const AppRoutes = () => {
  return useRoutes([
    { path: "/login", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/ajouter-article", element: <ArticleForm /> },
    {path: "/ajouter-categorie",element: <CategoriesForm/>},
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
