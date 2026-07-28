import PageHeader from "../components/PageHeader";
import WritingSection from "../components/WritingSection";
import DocumentSection from "../components/DocumentSection";


function Writing() {
  return (
    <main className="writing-page">

      <PageHeader
        eyebrow="Writing"
        title="Engineering notes."
        description="Architecture, development logs and technical articles."
      />


      <WritingSection />


      <DocumentSection />

    </main>
  );
}


export default Writing;
