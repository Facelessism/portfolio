import credentials from "../generated/credentials.json";

export function getCredentials() {
  return credentials;
}

export function getCredential(slug) {
  return credentials.find(
    (credential) =>
      credential.slug === slug
  );
}

export function getCredentialUrl(
  filename
) {
  const base =
    import.meta.env.BASE_URL;

  return `${base}credentials/${encodeURIComponent(
    filename
  )}`;
}
