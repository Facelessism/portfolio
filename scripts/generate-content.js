import fs from "fs/promises";
import path from "path";

import convert from "./converters/convert.js";

import {
  createSlug,
  createTitle,
  extractInfo,
} from "./utils/content.js";

const ROOT = process.cwd();

const UPLOADS =
  path.join(
    ROOT,
    "src/content/uploads"
  );

const OUTPUT =
  path.join(
    ROOT,
    "src/generated/content"
  );

const CONTENT_JSON =
  path.join(
    ROOT,
    "src/generated/content.json"
  );

async function generate() {
  await fs.mkdir(
    OUTPUT,
    { recursive: true }
  );

  const files =
    await fs.readdir(UPLOADS);

  const content = [];

  for (const filename of files) {

    const input =
      path.join(
        UPLOADS,
        filename
      );

    const stats =
      await fs.stat(input);

    if (!stats.isFile()) {
      continue;
    }

    const markdown =
      await convert(input);

    const slug =
      createSlug(filename);

    const output =
      path.join(
        OUTPUT,
        `${slug}.md`
      );

    await fs.writeFile(
      output,
      markdown,
      "utf8"
    );

    const {
      description,
      readTime,
    } =
      extractInfo(markdown);

    content.push({
      id: slug,

      slug,

      title:
        createTitle(filename),

      filename:
        `${slug}.md`,

      original:
        filename,

      extension:
        path
          .extname(filename)
          .slice(1)
          .toLowerCase(),

      description,

      readTime,
    });
  }

  content.sort((a, b) =>
    a.title.localeCompare(
      b.title
    )
  );

  await fs.writeFile(
    CONTENT_JSON,
    JSON.stringify(
      content,
      null,
      2
    )
  );

  console.log(
    ` Generated ${content.length} content item(s)`
  );
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});
