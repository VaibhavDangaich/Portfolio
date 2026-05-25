export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 02 — Where I&apos;ve been</span>
      </div>
      <h2 className="section-title" data-reveal="">
        The <em>résumé</em>, abbreviated.
      </h2>

      <div className="exp-list">
        <div className="exp-row" data-reveal="" data-cursor="hover">
          <div className="exp-date">
            Feb 2026 — Present
            <b>now</b>
          </div>
          <div className="exp-role">
            <h3>
              AI <em>Intern</em>
            </h3>
            <div className="co">Konect U</div>
          </div>
          <div className="exp-bullets">
            <ul>
              <li>
                Engineered secure, real-time data ingestion pipelines using
                Apache NiFi and Kafka for a defense-oriented government
                intelligence project.
              </li>
              <li>
                Developed LangChain-powered LLM workflows and Neo4j knowledge
                graphs to extract entities, map ontologies, and enable
                structured reasoning over unstructured data.
              </li>
            </ul>
          </div>
        </div>

        <div className="exp-row" data-reveal="" data-cursor="hover">
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
                Collaborated in an agile team to develop and maintain scalable
                full-stack applications, translating client business
                requirements into shipped features.
              </li>
              <li>
                Contributed to system design and API integration across diverse
                client needs.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
