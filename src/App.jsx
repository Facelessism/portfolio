import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedWork from "./components/FeaturedWork";
import GitHub from "./components/GitHub";
import Writing from "./components/Writing";
import About from "./components/About";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <FeaturedWork />

        <GitHub />

        <Writing />

        <About />
      </main>

      <Footer />
    </>
  );
}

export default App;
