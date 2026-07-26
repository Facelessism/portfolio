const BASE_URL = "https://api.github.com";

export async function fetchUserRepositories(username) {
  const response = await fetch(
    `${BASE_URL}/users/${username}/repos?per_page=20&sort=updated`
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch the GitHub repositories"
    );
  }

  return response.json();
}
