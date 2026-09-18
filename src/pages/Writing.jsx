import SEO from "../components/SEO";
import PageHeader from "../components/PageHeader";
import WritingSection from "../components/WritingSection";
import DocumentSection from "../components/DocumentSection";
import Container from "../components/Container";

function Writing() {
  return (
    <main className="writing-page">
      <SEO
        title="Engineering Notes | Bighna Raj Bhattmishra"
        description="Technical writing and engineering notes on developer tooling, software architecture, backend systems and open source."
        path="/writing"
      />

      <PageHeader
        eyebrow="Writing"
        title="Engineering Writings"
        description="Architecture, development logs and technical articles."
      />

      <Container>
        <WritingSection />
        <DocumentSection />
      </Container>
    </main>
  );
}

export default Writing;
