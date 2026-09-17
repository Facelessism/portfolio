import { useEffect } from "react";

const SITE_URL = "https://facelessism.github.io/portfolio";

function SEO({
  title,
  description,
  path = "",
}) {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector(
      'meta[name="description"]',
    );

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description,
      );
    }

    const canonical = document.querySelector(
      'link[rel="canonical"]',
    );

    if (canonical) {
      canonical.setAttribute(
        "href",
        `${SITE_URL}${path}`,
      );
    }
  }, [
    title,
    description,
    path,
  ]);

  return null;
}

export default SEO;
