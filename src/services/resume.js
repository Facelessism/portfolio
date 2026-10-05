import resume from "../generated/resume.json";

export function getResumeUrl() {
  if (!resume?.filename) {
    return null;
  }

  const base = import.meta.env.BASE_URL;

  return `${base}resume/${encodeURIComponent(resume.filename)}`;
}
