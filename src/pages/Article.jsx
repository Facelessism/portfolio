import { Link, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import SEO from "../components/SEO";
import content from "../generated/content.json";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

const markdownFiles = import.meta.glob(
  "../generated/content/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

function Article() {
  const { slug } = useParams();

  const article = content.find(
    (item) => item.slug === slug,
  );

  if (!article) {
    return (
      <main className="article-page">
        <SEO
          title="Article Not Found | Bighna Raj Bhattmishra"
          description="The requested article could not be found."
          path={`/writing/${slug || ""}`}
        />

        <h1>
          Article not found.
        </h1>

        <Link to="/writing">
          ← Back to writing
        </Link>
      </main>
    );
  }

  const markdownPath =
    `../generated/content/${article.filename}`;

  const markdown =
    markdownFiles[markdownPath];

  if (!markdown) {
    return (
      <main className="article-page">
        <SEO
          title={`${article.title} | Bighna Raj Bhattmishra`}
          description={article.description}
          path={`/writing/${article.slug}`}
        />

        <h1>
          Content unavailable.
        </h1>

        <p>
          The markdown file could not be loaded.
        </p>

        <Link to="/writing">
          ← Back to writing
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <SEO
        title={`${article.title} | Bighna Raj Bhattmishra`}
        description={article.description}
        path={`/writing/${article.slug}`}
      />

      <Link
        to="/writing"
        className="article-back"
      >
        ← Back to writing
      </Link>

      <article className="article-content">
        <ReactMarkdown
          remarkPlugins={[
            remarkMath,
          ]}
          rehypePlugins={[
            rehypeKatex,
            rehypeHighlight,
          ]}
        >
          {markdown}
        </ReactMarkdown>
      </article>

      <footer className="article-footer">
        <Link
          to="/writing"
          className="article-back"
        >
          ← Back to writing
        </Link>
      </footer>
    </main>
  );
}

export default Article;
