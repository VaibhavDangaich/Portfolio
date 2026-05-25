export default function Skills() {
  return (
    <section className="skills" id="stack">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 04 — Stack</span>
      </div>
      <h2 className="section-title" data-reveal="">
        Tools of the <em>trade</em>.
      </h2>
      <div className="skill-grid">
        <div className="skill-col" data-reveal="">
          <h4>
            Languages <span>α</span>
          </h4>
          <ul>
            <li>C / C++</li>
            <li>Python</li>
            <li>JavaScript</li>
            <li>HTML / CSS</li>
          </ul>
        </div>
        <div className="skill-col" data-reveal="">
          <h4>
            Frameworks <span>β</span>
          </h4>
          <ul>
            <li>LangChain</li>
            <li>React · Next.js</li>
            <li>FastAPI</li>
            <li>Tailwind</li>
            <li>Strapi</li>
            <li>scikit-learn</li>
          </ul>
        </div>
        <div className="skill-col" data-reveal="">
          <h4>
            Tools <span>γ</span>
          </h4>
          <ul>
            <li>Git · Docker</li>
            <li>Apache Kafka</li>
            <li>Apache NiFi</li>
            <li>Neo4j · MongoDB</li>
            <li>Vector DBs</li>
            <li>Vercel · Postman</li>
          </ul>
        </div>
        <div className="skill-col" data-reveal="">
          <h4>
            Curious about <span>δ</span>
          </h4>
          <ul>
            <li>Generative AI</li>
            <li>RAG &amp; LLMs</li>
            <li>Knowledge Graphs</li>
            <li>Web Dev</li>
            <li>Comp. Programming</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
