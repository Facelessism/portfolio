import SEO from "../components/SEO";
import Hero from "../components/Hero";
import RepositoryWorkspace from "../components/RepositoryWorkspace";
import ActivityTerminal from "../components/ActivityTerminal";
import RecentWork from "../components/RecentWork";

function Home() {
  return (
    <>
      <SEO
        title="Bighna Raj Bhattmishra | Backend, Developer Tooling & Open Source"
        description="Bighna Raj Bhattmishra builds backend systems, developer tools, automation and open-source software."
      />

      <Hero />
      <RepositoryWorkspace />
      <ActivityTerminal />
      <RecentWork />
    </>
  );
}

export default Home;
