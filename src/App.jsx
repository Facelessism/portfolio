import {
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./layouts/Layout";

import Home from "./pages/Home";
import GitHub from "./pages/GitHub";
import Writing from "./pages/Writing";
import Article from "./pages/Article";
import DocumentViewer from "./pages/DocumentViewer";
import Certificates from "./pages/Certificates";
import About from "./pages/About";

function App() {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/github"
          element={<GitHub />}
        />

        <Route
          path="/writing"
          element={<Writing />}
        />

        <Route
          path="/writing/:slug"
          element={<Article />}
        />

        <Route
          path="/writing/document/:slug"
          element={<DocumentViewer />}
        />

        <Route
          path="/certificates"
          element={<Certificates />}
        />

        <Route
          path="/about"
          element={<About />}
        />

      </Route>

    </Routes>
  );
}

export default App;
