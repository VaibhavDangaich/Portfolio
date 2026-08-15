import { Reveal } from "@/components/motion/Reveal";
import SectionHead from "@/components/motion/SectionHead";

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <SectionHead label="§ 02 — Where I've been">
        The <em>résumé</em>, abbreviated.
      </SectionHead>

      <div className="exp-list">
        <Reveal y={28} delay={0.05}>
          <div className="exp-row" data-cursor="hover">
            <div className="exp-date">
              May 2026 — Jul 2026
              <b>latest</b>
            </div>
            <div className="exp-role">
              <h3>
                SDE <em>Intern</em>
              </h3>
              <div className="co">123 of AI</div>
            </div>
            <div className="exp-bullets">
              <ul>
                <li>
                  Built cohort-based learning on a Next.js / React + Node.js /
                  TypeScript platform on Azure — enrollment, scheduling, streaks,
                  XP leaderboards, certificates and REST APIs, plus 10 idempotent
                  scripts migrating the course catalog.
                </li>
                <li>
                  Owned the monetization stack — Razorpay orders, subscriptions
                  and webhooks, an idempotent entitlements service, and a
                  ledger-based credits system auto-granting across 3 tiers, with
                  every offer priced server-side to block client-side tampering.
                </li>
                <li>
                  Engineered a personalized recommendation engine using vector
                  embeddings and semantic search (Azure OpenAI) targeting each
                  learner&apos;s weak concepts; shipped the DRM course player and
                  audited Amplitude telemetry across 132 routes.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal y={28} delay={0.1}>
          <div className="exp-row" data-cursor="hover">
            <div className="exp-date">Feb 2026 — May 2026</div>
            <div className="exp-role">
              <h3>
                AI <em>Intern</em>
              </h3>
              <div className="co">Konect U</div>
            </div>
            <div className="exp-bullets">
              <ul>
                <li>
                  Designed secure, real-time data ingestion pipelines using
                  Apache NiFi and Apache Kafka, routing 4 document formats (PDF,
                  spreadsheet, Office, image) for a defense-oriented government
                  intelligence project.
                </li>
                <li>
                  Developed LangChain-powered LLM workflows and Neo4j knowledge
                  graphs to extract entities and map ontologies, lifting entity
                  search recall from 70% to 95% with zero false merges.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal y={28} delay={0.15}>
          <div className="exp-row" data-cursor="hover">
            <div className="exp-date">
              Oct 2025 — Dec 2025
              <b>LOR earned</b>
            </div>
            <div className="exp-role">
              <h3>
                Full Stack <em>Intern</em>
              </h3>
              <div className="co">Konect U</div>
            </div>
            <div className="exp-bullets">
              <ul>
                <li>
                  Delivered full-stack apps in an agile team, translating client
                  requirements into technical specs and integrating third-party
                  APIs.
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
