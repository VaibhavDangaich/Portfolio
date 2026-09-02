import DepthText from "@/components/DepthText";
import { Entrance } from "@/components/motion/Reveal";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <div>
          <Entrance delay={0.1}>
            <div className="section-label">
              <span className="line" />
              <span>§ 00 — Hello</span>
            </div>
          </Entrance>
          {/* DepthText (React Bits) replaces the old data-scramble effect —
              two instances so "Vaibhav" / "Dangaich" keep stacking the way
              the rest of the hero expects. pointerTracking is off on both:
              with the lines stacked, a cursor sitting between them would
              otherwise tilt each line toward it in opposite directions: the
              synced autoOrbit fallback (both mount together, so their
              orbits stay in phase) is the coherent version of this. */}
          <Entrance delay={0.22} y={28}>
            <h1 className="hero-name">
              <DepthText
                text="Vaibhav"
                className="hero-name__first"
                layers={18}
                depth={2}
                faceColor="var(--ink)"
                depthColor="var(--accent)"
                tilt={5}
                pointerTracking={false}
                autoOrbit
                orbitSpeed={0.28}
                fontSize="clamp(52px, 7.5vw, 128px)"
                fontWeight={400}
                shadow={false}
              />
              <span className="hero-name__last-row">
                <span className="hero-name__dash" aria-hidden="true">
                  —
                </span>
                <DepthText
                  text="Dangaich"
                  className="hero-name__last"
                  layers={18}
                  depth={2}
                  faceColor="var(--accent)"
                  depthColor="var(--ink)"
                  tilt={5}
                  pointerTracking={false}
                  autoOrbit
                  orbitSpeed={0.28}
                  fontSize="clamp(52px, 7.5vw, 128px)"
                  fontWeight={400}
                  shadow
                />
              </span>
            </h1>
          </Entrance>
        </div>

        <Entrance delay={0.38}>
          <p className="hero-sub">
            I build with <strong>LLMs</strong>, knowledge graphs, and a worrying
            amount of caffeine. Just wrapped an SDE internship at{" "}
            <strong>123 of AI</strong> — cohort learning, payments and a
            recommendation engine on Azure. Before that: real-time pipelines for
            a defense-intelligence project, and a{" "}
            <strong>first-authored paper</strong> on ontology-guided knowledge
            graph extraction.
          </p>
        </Entrance>

        <Entrance delay={0.5}>
          <div className="hero-meta">
            <div>
              <b>BIT Mesra</b>
              AIML, B.Tech
              <br />
              2023 — 2027
            </div>
            <div>
              <b>123 of AI</b>
              SDE Intern
              <br />
              May — Jul 2026
            </div>
            <div>
              <b>Jharkhand → ∞</b>
              IST, GMT+5:30
              <br />
              chai-powered
            </div>
          </div>
        </Entrance>

        <div className="scroll-cue" aria-hidden="true">
          <span className="bar" />
          <span>scroll · or grab the graph</span>
        </div>
      </div>

      {/* Untouched: hero-graph.js owns this canvas and its label positioning. */}
      <div className="hero-canvas-wrap" data-cursor="grab">
        <canvas id="hero-canvas" />
        <div className="graph-labels" id="graph-labels" />
        <div className="graph-counter">
          <span>nodes / edges</span>
          <b id="graph-counter">— / —</b>
        </div>
        <div className="graph-hint">
          <span className="ico" />
          <span>drag to rotate · click a node</span>
        </div>
      </div>
    </section>
  );
}
