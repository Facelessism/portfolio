import { useEffect } from "react";

import site from "../config/site.js";

function SEO({ title, description, path = "" }) {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    const canonical = document.querySelector('link[rel="canonical"]');

    if (canonical) {
      canonical.setAttribute("href", `${site.url}${path}`);
    }
  }, [title, description, path]);

  return null;
}

export default SEO;
