import fs from "fs/promises";
import { OfficeConverter } from "officeparser";

export default async function convert(file) {
  const extension =
    file
      .split(".")
      .pop()
      .toLowerCase();

  if (
    extension === "md" ||
    extension === "txt"
  ) {
    return fs.readFile(
      file,
      "utf8"
    );
  }

  const { value } =
    await OfficeConverter.convert(
      file,
      "md"
    );

  return value;
}
