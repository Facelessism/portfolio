import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import CredentialsSection from "../components/CredentialsSection";

function Certificates() {
  return (
    <main className="certificates-page">
      <SEO
        title="Credentials | Bighna Raj Bhattmishra"
        description="Certificates, program credentials and other professional achievements of Bighna Raj Bhattmishra."
        path="/certificates"
      />

      <PageHeader
        eyebrow="Certificates"
        title="Credentials and achievements."
        description="A collection of certifications, program credentials and other achievements."
      />

      <CredentialsSection />
    </main>
  );
}

export default Certificates;
