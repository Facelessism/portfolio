const BASE_URL = "https://api.github.com";

export async function fetchRepository(owner, repo) {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to fetch ${owner}/${repo}`
    );
  }

  return response.json();
}
