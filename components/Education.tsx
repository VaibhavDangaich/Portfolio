import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHead from "@/components/motion/SectionHead";

export default function Education() {
  return (
    <section className="education" id="education">
      <SectionHead label="§ 06 — Education">
        Schools <em>attended</em>.
      </SectionHead>

      <Stagger className="edu-list">
        <StaggerItem className="edu-row" dataCursor="hover">
          <div className="when">Sep 2023 — Sep 2027</div>
          <div className="what">
            <h3>Birla Institute of Technology, Mesra</h3>
            <p>B.Tech · Artificial Intelligence &amp; Machine Learning</p>
          </div>
          <div className="score">
            8.4<small>CGPA</small>
          </div>
        </StaggerItem>
        <StaggerItem className="edu-row" dataCursor="hover">
          <div className="when">2022</div>
          <div className="what">
            <h3>Subhash Public School</h3>
            <p>CBSE · Class XII · Jharkhand</p>
          </div>
          <div className="score">
            89%<small>Class XII</small>
          </div>
        </StaggerItem>
        <StaggerItem className="edu-row" dataCursor="hover">
          <div className="when">2020</div>
          <div className="what">
            <h3>BNS DAV Public School</h3>
            <p>CBSE · Class X · Jharkhand</p>
          </div>
          <div className="score">
            93.2%<small>Class X</small>
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
