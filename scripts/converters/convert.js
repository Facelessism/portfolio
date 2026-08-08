import fs from "fs/promises";
import path from "path";

import { OfficeConverter } from "officeparser";


const DIRECT_FORMATS = new Set([
  "md",
  "txt",
]);


export default async function convert(file) {
  const extension =
    path
      .extname(file)
      .slice(1)
      .toLowerCase();


  if (
    DIRECT_FORMATS.has(
      extension
    )
  ) {
    return fs.readFile(
      file,
      "utf8"
    );
  }


  try {
    const { value } =
      await OfficeConverter.convert(
        file,
        "md"
      );

    return value;
  } catch (error) {
    throw new Error(
      `Unable to convert .${extension} file: ${error.message}`
    );
  }
}

