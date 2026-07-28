import { useParams, Link } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import content from "../generated/content.json";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";


const markdownFiles = import.meta.glob(
  "../content/articles/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
);

function Article() {
  const { slug } = useParams();

  const article =
    content.find(
      (item) =>
        item.slug === slug &&
        item.type === "article"
    );

  if (!article) {
    return (
      <main className="article-page">

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
    `../content/articles/${article.filename}`;

  const markdown =
    markdownFiles[markdownPath];

  if (!markdown) {
    return (
      <main className="article-page">

        <h1>
          Content unavailable.
        </h1>

        <p>
          The markdown file exists in the
          content index but could not be loaded.
        </p>

        <Link to="/writing">
          ← Back to writing
        </Link>

      </main>
    );
  }

  return (
  <main className="article-page">

    <Link
      to="/writing"
      className="article-back"
    >
      ← Back to writings
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
        ← Back to writings
      </Link>

    </footer>


  </main>
);
}

export default Article;
