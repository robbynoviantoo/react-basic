import { useEffect } from "react";
import Navbar from "./components/layout/navbar/Navbar";
import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Lenis from "lenis";
import Mcs from "./pages/mcs/Mcs";
import McsDetail from "./pages/mcs/McsDetail";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mcs" element={<Mcs />} />
        <Route path="/mcs/:id" element={<McsDetail />} />
      </Routes>
    </>
  );
}

export default App;
