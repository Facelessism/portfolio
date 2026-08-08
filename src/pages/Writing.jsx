import PageHeader from "../components/PageHeader";
import WritingSection from "../components/WritingSection";
import DocumentSection from "../components/DocumentSection";
import Container from "../components/Container";

function Writing() {
  return (
    <main className="writing-page">

      <PageHeader
        eyebrow="Writing"
        title="Engineering notes."
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

