import { useState } from "react";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Farms from "./pages/Farms";
import Economics from "./pages/Economics";
import Mcp from "./pages/Mcp";

type Route = "/" | "/predict" | "/farms" | "/economics" | "/mcp";

const ROUTES: Record<Route, React.ComponentType> = {
  "/": Home,
  "/predict": Predict,
  "/farms": Farms,
  "/economics": Economics,
  "/mcp": Mcp,
};

export default function App() {
  const [path, setPath] = useState<Route>("/");

  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath((next as Route) || "/");
  };

  const Page = ROUTES[path] || Home;

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={navigate} />
      <Page />
    </div>
  );
}
