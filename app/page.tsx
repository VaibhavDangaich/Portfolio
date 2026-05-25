import About from "@/components/About";
import Achievements from "@/components/Achievements";
import ClientScripts from "@/components/ClientScripts";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import DarkModeBulb from "@/components/DarkModeBulb";
import DarkModeFX from "@/components/DarkModeFX";
import RealisticAvatarLoader from "@/components/RealisticAvatarLoader";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Frame from "@/components/Frame";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import SoundToggle from "@/components/SoundToggle";
import TopBar from "@/components/TopBar";
import TryPrompt from "@/components/TryPrompt";

export default function Page() {
  return (
    <>
      <Frame />
      <TopBar />

      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Achievements />
      <Contact />

      {/* floating widgets the scripts attach behavior to */}
      <DarkModeBulb />
      <TryPrompt />
      <DarkModeFX />
      <RealisticAvatarLoader />
      <Cursor />
      <SoundToggle />

      <ClientScripts />
    </>
  );
}
