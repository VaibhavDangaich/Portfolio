export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 03 — Things I&apos;ve built</span>
      </div>
      <div className="projects-intro">
        <h2 className="section-title" data-reveal="">
          Side <em>quests</em>.
        </h2>
        <div className="hint" data-reveal="">
          <b>* pick them up.</b>
          <br />
          grab a card, fling it, watch it spring back. yes, that&apos;s the joke.
        </div>
      </div>

      <div id="physics-stage" data-cursor="grab">
        <div className="pcard" data-x="-220" data-y="-80" data-rot="-4">
          <div className="pyear">
            <span>Mar — Apr 2025</span>
            <span>#01</span>
          </div>
          <h3>
            AI <em>Resume</em> Builder
          </h3>
          <div className="pdesc">
            Full-stack app that builds a polished resume in a fraction of the
            time. React 19, Strapi CMS, Neon DB, Clerk auth. AI does the heavy
            lifting on content suggestions; you stay in the driver&apos;s seat.
          </div>
          <div className="pstack">
            <span>React 19</span>
            <span>Tailwind v4</span>
            <span>Strapi</span>
            <span>Neon</span>
            <span>Clerk</span>
            <span>shadcn</span>
          </div>
          <div className="plinks">
            <a href="#" data-cursor="link">GitHub ↗</a>
            <a href="#" data-cursor="link">Live ↗</a>
          </div>
          <div className="pmetric">
            75% faster resume creation · −15 min average
          </div>
        </div>

        <div className="pcard" data-x="180" data-y="60" data-rot="3">
          <div className="pyear">
            <span>May — Jun 2025</span>
            <span>#02</span>
          </div>
          <h3>
            <em>PushMuse</em>
          </h3>
          <div className="pdesc">
            A CLI git assistant that writes your commit messages so you don&apos;t
            have to. Reads your diff, calls Gemini, hands you a sensible{" "}
            <code style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
              feat(api):…
            </code>{" "}
            line. Filters binary diffs to keep tokens lean.
          </div>
          <div className="pstack">
            <span>Node.js</span>
            <span>Next.js</span>
            <span>Express</span>
            <span>Gemini API</span>
            <span>CLI</span>
            <span>Render</span>
          </div>
          <div className="plinks">
            <a href="#" data-cursor="link">GitHub ↗</a>
            <a href="#" data-cursor="link">Live ↗</a>
          </div>
          <div className="pmetric">−90% manual typing · 30–50% token savings</div>
        </div>
      </div>
    </section>
  );
}
