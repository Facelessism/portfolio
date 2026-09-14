import Hero from "../components/Hero";
import RepositoryWorkspace from "../components/RepositoryWorkspace";
import ActivityTerminal from "../components/ActivityTerminal";
import RecentWork from "../components/RecentWork";

function Home() {
  return (
    <>
      <Hero />
      <RepositoryWorkspace />
      <ActivityTerminal />
      <RecentWork />
    </>
  );
}

export default Home;
