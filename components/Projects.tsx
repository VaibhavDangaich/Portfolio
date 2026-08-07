export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 04 — Things I&apos;ve built</span>
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
        <div className="pcard" data-x="-330" data-y="-170" data-rot="-4">
          <div className="pyear">
            <span>Aug 2026</span>
            <span>#01</span>
          </div>
          <h3>
            Visual <em>Activity</em> Agent
          </h3>
          <div className="pdesc">
            A privacy-conscious Chrome MV3 extension that watches navigation,
            clicks and focus, ships downscaled screenshots to a Node ingest API,
            and lets Gemini vision summarize the session server-side. The
            browser never runs a model, and perceptual-hash dedup drops
            near-identical frames — so a static page costs almost no image data
            at all.
          </div>
          <div className="pstack">
            <span>Chrome MV3</span>
            <span>Node.js</span>
            <span>Express</span>
            <span>Supabase</span>
            <span>Postgres</span>
            <span>Gemini Vision</span>
          </div>
          <div className="plinks">
            <a
              href="https://github.com/VaibhavDangaich/visual-activity-agent"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
          <div className="pmetric">
            dHash dedup · single-digit KB frames · idle-aware capture
          </div>
        </div>

        <div className="pcard" data-x="10" data-y="-190" data-rot="-5">
          <div className="pyear">
            <span>Jun — Jul 2026</span>
            <span>#02</span>
          </div>
          <h3>
            <em>FOIAtlas</em>
          </h3>
          <div className="pdesc">
            An investigative GraphRAG tool that turns released FOIA/RTI records
            into a queryable knowledge graph — a 6-stage pipeline (parse →
            extract → resolve → embed → write) with schema-constrained Gemini
            extraction into an embedded Kùzu graph. Every redaction is a
            first-class node carrying its legal exemption code, so concealed
            spans become leads instead of dead ends.
          </div>
          <div className="pstack">
            <span>Next.js 16</span>
            <span>TypeScript</span>
            <span>Kùzu</span>
            <span>Gemini</span>
            <span>LangGraph</span>
            <span>Cytoscape</span>
          </div>
          <div className="plinks">
            <a
              href="https://github.com/VaibhavDangaich/foiatlas"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
          <div className="pmetric">
            Semantic-search chat · LangGraph ReAct agent · Cytoscape explorer
          </div>
        </div>

        <div className="pcard pcard--npm" data-x="340" data-y="-140" data-rot="5">
          <div className="pyear">
            <span>
              Feb 2026 — present
              <span className="pnpm-badge">npm</span>
            </span>
            <span>#03</span>
          </div>
          <h3>
            <em>mnex</em>
          </h3>
          <div className="pdesc">
            A cognitive-architecture AI coding agent that lives in your terminal.
            Stateful LangGraph planner → executor → critic loop for
            self-correcting multi-step reasoning over your codebase, a 5-tier
            persistent memory on SQLite WAL, and a local-first router (Ollama →
            OpenAI/Gemini). Treats the agent as a cognitive system, not a
            chatbot.
          </div>
          <div className="pstack">
            <span>Node.js</span>
            <span>LangGraph</span>
            <span>LangChain</span>
            <span>SQLite</span>
            <span>Ollama</span>
            <span>Gemini API</span>
            <span>CLI</span>
            <span>npm</span>
          </div>
          <div className="plinks">
            <a
              href="https://github.com/VaibhavDangaich/MNEX"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.npmjs.com/package/@vaibhav_dangaich/mnex"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm ↗
            </a>
          </div>
          <div className="pmetric">
            sub-50ms recall · −40% cloud inference · 3.5k lines, zero external
            infra
          </div>
        </div>

        <div className="pcard" data-x="-190" data-y="160" data-rot="3">
          <div className="pyear">
            <span>May — Jun 2025</span>
            <span>#04</span>
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
            <a
              href="https://github.com/VaibhavDangaich/ai-commit-cli"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
          <div className="pmetric">−90% manual typing · 30–50% token savings</div>
        </div>

        <div className="pcard" data-x="200" data-y="180" data-rot="-3">
          <div className="pyear">
            <span>Mar — Apr 2025</span>
            <span>#05</span>
          </div>
          <h3>
            AI <em>Resume</em> Builder
          </h3>
          <div className="pdesc">
            Full-stack app that builds a polished resume in a fraction of the
            time. React 19, Strapi CMS, Neon Postgres, Clerk auth, and a
            real-time editor in shadcn + Tailwind v4. AI does the heavy lifting
            on content suggestions; you stay in the driver&apos;s seat.
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
            <a
              href="https://github.com/VaibhavDangaich/AI-resume-builder"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://ai-resume-builder-8a6b.vercel.app"
              data-cursor="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live ↗
            </a>
          </div>
          <div className="pmetric">
            75% faster resume creation · −15 min average
          </div>
        </div>
      </div>
    </section>
  );
}
