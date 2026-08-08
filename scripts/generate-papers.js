import fs from "fs/promises";
import path from "path";

import {
  createSlug,
  createTitle,
} from "./utils/content.js";

const ROOT = process.cwd();

const PAPERS =
  path.join(
    ROOT,
    "src/content/papers"
  );

const PUBLIC_PAPERS =
  path.join(
    ROOT,
    "public/papers"
  );

const OUTPUT =
  path.join(
    ROOT,
    "src/generated"
  );

const PAPERS_JSON =
  path.join(
    OUTPUT,
    "papers.json"
  );

const ONLINE_FORMATS = new Set([
  "pdf",
]);

function getFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function generatePapers() {
  await fs.mkdir(
    OUTPUT,
    {
      recursive: true,
    }
  );

  await fs.mkdir(
    PUBLIC_PAPERS,
    {
      recursive: true,
    }
  );

  const files =
    await fs.readdir(
      PAPERS
    );

  const papers = [];

  for (const filename of files) {
    const input =
      path.join(
        PAPERS,
        filename
      );

    const stats =
      await fs.stat(
        input
      );


    if (!stats.isFile()) {
      continue;
    }

    const extension =
      path
        .extname(filename)
        .slice(1)
        .toLowerCase();

    const slug =
      createSlug(filename);

    const publicPath =
      path.join(
        PUBLIC_PAPERS,
        filename
      );

    await fs.copyFile(
      input,
      publicPath
    );

    papers.push({
      id: slug,

      slug,

      title:
        createTitle(filename),

      filename,

      source:
        filename,

      extension,

      size:
        getFileSize(
          stats.size
        ),

      online:
        ONLINE_FORMATS.has(
          extension
        ),
    });
  }

  papers.sort(
    (a, b) =>
      a.title.localeCompare(
        b.title
      )
  );

  await fs.writeFile(
    PAPERS_JSON,
    JSON.stringify(
      papers,
      null,
      2
    ),
    "utf8"
  );


  console.log(
    `✓ Generated ${papers.length} paper(s)`
  );
}

export default generatePapers;
