import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHead from "@/components/motion/SectionHead";

export default function Achievements() {
  return (
    <section className="achieve" id="wins">
      <SectionHead label="§ 07 — A few wins">Receipts.</SectionHead>
      {/* `lift` reproduces .ach-card:hover here, since the inline transform
          framer-motion writes would otherwise outrank the CSS rule. */}
      <Stagger className="ach-grid">
        <StaggerItem className="ach-card" dataCursor="hover" lift>
          <span className="corner">/ 01</span>
          <div className="big">400+</div>
          <div className="lbl">DSA problems solved</div>
          <p>
            Across LeetCode, Codeforces, GeeksforGeeks and CodeStudio. Yes, I
            have a spreadsheet. No, I won&apos;t show it to you.
          </p>
        </StaggerItem>
        <StaggerItem className="ach-card" dataCursor="hover" lift>
          <span className="corner">/ 02</span>
          <div className="big">Top 5</div>
          <div className="lbl">IEEE CTF · BIT Mesra · 200+ teams</div>
          <p>
            Secured a top-5 finish at the IEEE Capture-The-Flag — solving
            real-world security challenges in a team of four, mostly on coffee
            and dread.
          </p>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
