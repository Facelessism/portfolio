import PageHeader from "../components/PageHeader";
import CredentialsSection from "../components/CredentialsSection";

function Certificates() {
  return (
    <main className="certificates-page">

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
