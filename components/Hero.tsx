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
              the rest of the hero expects. Both share measureSelector
              ".hero-name": stacked lines each tracking the pointer against
              their own (differently positioned) box would tilt opposite
              directions when the cursor sits between them, so instead both
              compute their rotation from the shared h1's box and rotate by
              the same degrees in sync.
              autoOrbit is off on both: it fights the pointerleave reset — on
              cursor-out, target snaps toward baseRotation but the very next
              tick would hand it back to the orbit at whatever phase it's
              reached, producing a small jump every time the pointer leaves
              the window. With it off, pointerleave is just a clean settle
              back to baseRotation. perspective is raised to 1100 (from the
              component's 900 default) so the two stacked boxes — each with
              its own vanishing point at 3.2px × 26 layers of extrusion —
              don't diverge into reading as separate objects. */}
          <Entrance delay={0.22} y={28}>
            <h1 className="hero-name">
              <DepthText
                text="Vaibhav"
                className="hero-name__first"
                measureSelector=".hero-name"
                layers={26}
                depth={3.2}
                faceColor="var(--ink)"
                depthColor="var(--accent)"
                tilt={9}
                pointerTracking
                smoothing={0.18}
                perspective={1100}
                autoOrbit={false}
                fontSize="clamp(52px, 7.5vw, 128px)"
                fontWeight={400}
                shadow
              />
              <span className="hero-name__last-row">
                <span className="hero-name__dash" aria-hidden="true">
                  —
                </span>
                <DepthText
                  text="Dangaich"
                  className="hero-name__last"
                  measureSelector=".hero-name"
                  layers={26}
                  depth={3.2}
                  faceColor="var(--accent)"
                  depthColor="var(--ink)"
                  tilt={9}
                  pointerTracking
                  smoothing={0.18}
                  perspective={1100}
                  autoOrbit={false}
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
