export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-text">
        <div>
          <div className="section-label" data-reveal="">
            <span className="line" />
            <span>§ 00 — Hello</span>
          </div>
          <h1 data-reveal="">
            <span className="first" data-scramble="">Vaibhav</span>
            <span className="last">Dangaich</span>
          </h1>
        </div>

        <p className="hero-sub" data-reveal="">
          I build with <strong>LLMs</strong>, knowledge graphs, and a worrying
          amount of caffeine. Currently wiring up{" "}
          <strong>real-time data pipelines</strong> for a defense-intelligence
          project at Konect U, and shipping side projects in the cracks between
          lectures.
        </p>

        <div className="hero-meta" data-reveal="">
          <div>
            <b>BIT Mesra</b>
            AIML, B.Tech
            <br />
            2023 — 2027
          </div>
          <div>
            <b>Konect U</b>
            AI Intern
            <br />
            Feb 2026 — now
          </div>
          <div>
            <b>Jharkhand → ∞</b>
            IST, GMT+5:30
            <br />
            chai-powered
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="bar" />
          <span>scroll · or grab the graph</span>
        </div>
      </div>

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
