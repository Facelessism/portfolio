import fs from "fs";
import path from "path";


const ROOT = process.cwd();

const CONTENT_DIR =
  path.join(ROOT, "src/content");

const OUTPUT =
  path.join(ROOT, "src/generated/content.json");



function createSlug(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}



function createTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}



function extractMarkdownInfo(filePath) {
  const content =
    fs.readFileSync(
      filePath,
      "utf-8"
    );


  const text =
    content
      .replace(/^#+\s.*$/gm, "")
      .replace(/[*_`>#]/g, "")
      .trim();


  const paragraphs =
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);


  const description =
    paragraphs[0] || "";


  const words =
    text.split(/\s+/)
      .filter(Boolean)
      .length;


  const readTime =
    Math.max(
      1,
      Math.ceil(words / 200)
    );


  return {
    description,

    readTime: `${readTime} min read`,
  };
}



function scan(folder, type) {
  const directory =
    path.join(
      CONTENT_DIR,
      folder
    );


  if (!fs.existsSync(directory)) {
    return [];
  }


  return fs
    .readdirSync(directory)
    .map((filename) => {

      const filePath =
        path.join(
          directory,
          filename
        );


      if (
        !fs.statSync(filePath)
          .isFile()
      ) {
        return null;
      }


      const extension =
        path.extname(filename)
          .slice(1)
          .toLowerCase();


      let extra = {
        description: "",
        readTime: "",
      };


      if (
        type === "article" &&
        extension === "md"
      ) {
        extra =
          extractMarkdownInfo(
            filePath
          );
      }


      const slug =
        createSlug(filename);


      return {
        id: slug,

        slug,

        title:
          createTitle(filename),

        type,

        filename,

        extension,

        path:
          filePath
            .replace(ROOT, "")
            .replace(/\\/g, "/"),

        ...extra,
      };

    })
    .filter(Boolean);
}



const content = [
  ...scan(
    "articles",
    "article"
  ),

  ...scan(
    "documents",
    "document"
  ),
];



fs.writeFileSync(
  OUTPUT,
  JSON.stringify(
    content,
    null,
    2
  )
);


console.log(
  `Generated ${content.length} content items`
);
