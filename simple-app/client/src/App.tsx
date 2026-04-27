import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Country from "./pages/Country";
import City from "./pages/City";
import Brief from "./pages/Brief";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="px-4 pb-8 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore/:country" element={<Country />} />
          <Route path="/explore/:country/:city" element={<City />} />
          <Route path="/explore/:country/:city/brief/:id" element={<Brief />} />
          <Route path="/brief/:id" element={<Brief />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
