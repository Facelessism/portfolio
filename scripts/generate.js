import generateContent from "./generate-content.js";
import generatePapers from "./generate-papers.js";
import generateCredentials from "./generate-credentials.js";
import generateResume from "./generate-resume.js";

async function generate() {
  console.log(
    "Generating portfolio content...\n"
  );

  await generateContent();
  await generatePapers();
  await generateCredentials();
  await generateResume();
  console.log("\nAll generated data updated successfully.");
}

generate().catch((error) => {
  console.error(
    "\nGeneration failed:"
  );

  console.error(error);

  process.exit(1);
});
