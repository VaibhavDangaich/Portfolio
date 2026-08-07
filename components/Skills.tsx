export default function Skills() {
  return (
    <section className="skills" id="stack">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 05 — Stack</span>
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
            <li>TypeScript</li>
            <li>SQL</li>
            <li>HTML / CSS</li>
          </ul>
        </div>
        <div className="skill-col" data-reveal="">
          <h4>
            Frameworks <span>β</span>
          </h4>
          <ul>
            <li>LangChain · LangGraph</li>
            <li>React · Next.js</li>
            <li>Node.js · Express</li>
            <li>FastAPI</li>
            <li>Tailwind</li>
            <li>Three.js</li>
            <li>scikit-learn</li>
          </ul>
        </div>
        <div className="skill-col" data-reveal="">
          <h4>
            Tools <span>γ</span>
          </h4>
          <ul>
            <li>Git · GitHub</li>
            <li>Docker · Azure</li>
            <li>Apache Kafka</li>
            <li>Apache NiFi</li>
            <li>Neo4j · Kùzu</li>
            <li>MongoDB · SQLite</li>
            <li>Jest · Postman</li>
            <li>Vector DBs</li>
          </ul>
        </div>
        <div className="skill-col" data-reveal="">
          <h4>
            Curious about <span>δ</span>
          </h4>
          <ul>
            <li>Generative AI (LLMs)</li>
            <li>RAG &amp; GraphRAG</li>
            <li>Knowledge Graphs</li>
            <li>Machine Learning</li>
            <li>Web Dev</li>
            <li>Comp. Programming</li>
          </ul>
        </div>
        <div className="skill-col skill-col--wide" data-reveal="">
          <h4>
            CS fundamentals <span>ε</span>
          </h4>
          <ul className="inline">
            <li>DBMS</li>
            <li>Operating Systems</li>
            <li>OOP</li>
            <li>Data Structures &amp; Algorithms</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
