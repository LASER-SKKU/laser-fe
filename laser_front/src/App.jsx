import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Details from "./pages/Details"
import Papers from "./pages/Papers"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/labs/:labId" element={<Details />} />
        <Route path="/papers/:paperId" element={<Papers />} />
      </Routes>
    </BrowserRouter>
  );
}