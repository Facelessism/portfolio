import SEO from "../components/SEO";
import Hero from "../components/Hero";
import RepositoryWorkspace from "../components/RepositoryWorkspace";
import ActivityTerminal from "../components/ActivityTerminal";
import RecentWork from "../components/RecentWork";

function Home() {
  return (
    <>
      <SEO
        title="Bighna Raj Bhattamishra | Backend, Developer Tooling & Open Source"
        description="Bighna Raj Bhattamishra builds backend systems, developer tools, automation and open-source software."
      />

      <Hero />
      <RepositoryWorkspace />
      <ActivityTerminal />
      <RecentWork />
    </>
  );
}

export default Home;
