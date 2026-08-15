import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import SectionHead from "@/components/motion/SectionHead";

export default function About() {
  return (
    <section className="about" id="about">
      <div>
        <SectionHead label="§ 01 — About">
          I&apos;m <em>Vaibhav</em>.
        </SectionHead>
        <div className="about-copy" style={{ marginTop: 48 }}>
          <Reveal delay={0.05} blur>
            <p>
              I&apos;m a final-year <span className="pop">AI &amp; ML</span>{" "}
              student at BIT Mesra. Most recently an SDE intern at 123 of AI,
              shipping a cohort-learning platform, a Razorpay monetization stack
              and an embeddings-based recommendation engine on Azure. Before
              that, Kafka pipelines and Neo4j graphs for a government
              intelligence project at Konect U.
            </p>
          </Reveal>
          <Reveal delay={0.12} blur>
            <p>
              By night, I either ship side projects, grind LeetCode, or argue
              with myself about which font to use on my portfolio.{" "}
              <span className="nb">(See: above.)</span>
            </p>
          </Reveal>
          <Reveal delay={0.19} blur>
            <p>
              Things I think about a lot: how to make LLMs <em>actually</em>{" "}
              useful, how knowledge graphs can replace half the SQL we write, and
              what a truly cognitive AI coding agent looks like — one with
              persistent memory and a critic loop, not a stateless chatbot.
              (I built one. It&apos;s below.)
            </p>
          </Reveal>
          <Reveal delay={0.26} blur>
            <p>I like clean APIs, dense code, and a well-placed em dash.</p>
          </Reveal>
        </div>
      </div>
      {/* The motion wrapper sits outside .fact so framer-motion's inline
          transform never overwrites the .fact:hover translate. */}
      <Stagger className="about-side" as="aside">
        <StaggerItem>
          <div className="fact" data-cursor="hover">
            <div className="k">CGPA</div>
            <div className="v">
              8.4<small>/10 · BIT Mesra · current</small>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="fact" data-cursor="hover">
            <div className="k">DSA problems solved</div>
            <div className="v">
              400+<small>LeetCode · Codeforces · GFG · CodeStudio</small>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="fact" data-cursor="hover">
            <div className="k">IEEE CTF, BIT Mesra</div>
            <div className="v">
              Top 5<small>/ 200+ teams</small>
            </div>
          </div>
        </StaggerItem>
        <StaggerItem>
          <div className="fact" data-cursor="hover">
            <div className="k">First-authored paper</div>
            <div className="v">
              arXiv<small>ontology-guided KG extraction · Jul 2026</small>
            </div>
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
