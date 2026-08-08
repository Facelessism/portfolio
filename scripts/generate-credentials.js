import fs from "fs/promises";
import path from "path";

import {
  createSlug,
  createTitle,
} from "./utils/content.js";

const ROOT = process.cwd();

const CREDENTIALS =
  path.join(
    ROOT,
    "src/content/credentials"
  );

const PUBLIC_CREDENTIALS =
  path.join(
    ROOT,
    "public/credentials"
  );

const OUTPUT =
  path.join(
    ROOT,
    "src/generated"
  );

const CREDENTIALS_JSON =
  path.join(
    OUTPUT,
    "credentials.json"
  );

function getFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function generateCredentials() {
  await fs.mkdir(
    OUTPUT,
    {
      recursive: true,
    }
  );

  await fs.mkdir(
    PUBLIC_CREDENTIALS,
    {
      recursive: true,
    }
  );

  const files =
    await fs.readdir(
      CREDENTIALS
    );

  const credentials = [];

  for (const filename of files) {
    const input =
      path.join(
        CREDENTIALS,
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

    await fs.copyFile(
      input,
      path.join(
        PUBLIC_CREDENTIALS,
        filename
      )
    );

    credentials.push({
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
    });
  }


  credentials.sort(
    (a, b) =>
      a.title.localeCompare(
        b.title
      )
  );

  await fs.writeFile(
    CREDENTIALS_JSON,
    JSON.stringify(
      credentials,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `✓ Generated ${credentials.length} credential(s)`
  );
}

export default generateCredentials;

