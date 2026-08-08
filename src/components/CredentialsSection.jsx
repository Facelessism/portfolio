import { getCredentials, getCredentialUrl } from "../services/credentials";

function CredentialsSection() {
  const credentials = getCredentials();

  return (
    <section className="credentials-section">
      <div className="section-header">
        <p className="section-eyebrow">Credentials</p>
        <h2>Certifications and achievements.</h2>
        <p>Certificates and credentials earned through programs, projects and professional work.</p>
      </div>

      {credentials.length > 0 ? (
        <div className="credentials-grid">
          {credentials.map((credential) => {
            const url = getCredentialUrl(credential.filename);
            return (
              <article key={credential.id} className="credential-card">
                <div className="credential-preview">
                  <span className="credential-format">{credential.extension.toUpperCase()}</span>
                  <div className="credential-lines">
                    <span /><span /><span /><span />
                  </div>
                </div>
                <div className="credential-content">
                  <h3>{credential.title}</h3>
                  <p>
                    {credential.extension.toUpperCase()} · {credential.size}
                  </p>
                  <div className="credential-actions">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-secondary"
                    >
                      View
                    </a>
                    <a href={url} download className="button button-secondary">
                      Download
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="section-empty">No credentials available yet.</p>
      )}
    </section>
  );
}

export default CredentialsSection;
