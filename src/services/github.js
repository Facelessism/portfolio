const BASE_URL = "https://api.github.com";

export async function fetchRepository(
  owner,
  repo
) {
  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => controller.abort(),
      5000
    );


  try {

    const response =
      await fetch(
        `${BASE_URL}/repos/${owner}/${repo}`,
        {
          signal:
            controller.signal,

          headers: {
            Accept:
              "application/vnd.github+json",
          },
        }
      );


    if (!response.ok) {
      throw new Error(
        `Unable to fetch ${owner}/${repo}`
      );
    }


    return await response.json();


  } catch (error) {

    if (
      error.name === "AbortError"
    ) {
      throw new Error(
        `Request timed out for ${owner}/${repo}`
      );
    }


    throw error;


  } finally {

    clearTimeout(timeout);

  }
}
