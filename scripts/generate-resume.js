import fs from "fs/promises";
import path from "path";

import {
  createTitle,
} from "./utils/content.js";

const ROOT = process.cwd();

const RESUME =
  path.join(
    ROOT,
    "src/content/resume"
  );

const PUBLIC_RESUME =
  path.join(
    ROOT,
    "public/resume"
  );

const OUTPUT =
  path.join(
    ROOT,
    "src/generated"
  );

const RESUME_JSON =
  path.join(
    OUTPUT,
    "resume.json"
  );

async function generateResume() {
  await fs.mkdir(
    OUTPUT,
    {
      recursive: true,
    }
  );

  await fs.mkdir(
    PUBLIC_RESUME,
    {
      recursive: true,
    }
  );

  const files =
    await fs.readdir(
      RESUME
    );

  const resumeFiles = [];

  for (const filename of files) {
    const input =
      path.join(
        RESUME,
        filename
      );

    const stats =
      await fs.stat(
        input
      );

    if (!stats.isFile()) {
      continue;
    }

    resumeFiles.push({
      filename,
      input,
      stats,
    });
  }

  if (resumeFiles.length === 0) {
    await fs.writeFile(
      RESUME_JSON,
      JSON.stringify(
        null,
        null,
        2
      ),
      "utf8"
    );

    console.log(
      "✓ No resume found"
    );

    return;
  }

  if (resumeFiles.length > 1) {
    throw new Error(
      "Resume directory must contain exactly one file."
    );
  }

  const resume =
    resumeFiles[0];

  await fs.copyFile(
    resume.input,
    path.join(
      PUBLIC_RESUME,
      resume.filename
    )
  );

  const extension =
    path
      .extname(
        resume.filename
      )
      .slice(1)
      .toLowerCase();

  const metadata = {
    filename:
      resume.filename,

    title:
      createTitle(
        resume.filename
      ),

    extension,

    size:
      resume.stats.size,
  };

  await fs.writeFile(
    RESUME_JSON,
    JSON.stringify(
      metadata,
      null,
      2
    ),
    "utf8"
  );

  console.log(
    "✓ Generated resume metadata"
  );
}

export default generateResume;
