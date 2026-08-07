export default function Publications() {
  return (
    <section className="publications" id="publications">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 03 — On the record</span>
      </div>
      <h2 className="section-title" data-reveal="">
        A <em>paper</em>, first-authored.
      </h2>

      <div className="pub-list">
        <article className="pub-card" data-reveal="" data-cursor="hover">
          <div className="pub-meta">
            <span>Preprint · arXiv:2607.28662 [cs.AI]</span>
            <span>Jul 2026</span>
          </div>
          <h3>
            An Ontology-Guided, Deduplication-Aware{" "}
            <em>Extraction Layer</em> for Knowledge Graph Construction from
            Heterogeneous Documents
          </h3>
          <div className="pub-authors">
            <b>Vaibhav Dangaich</b>, Kevin Lewis, Kundeshwar Pundalik
          </div>
          <p className="pub-abstract">
            Ontology-guided two-pass extraction with a locally hosted Qwen3.5-9B
            over a Kafka document stream. Live ontology-slice retrieval cut
            catalog overhead by ~94%, and a six-algorithm deduplication +
            embedding-resolution pipeline raised search recall from 70% to 95%
            — with zero false merges.
          </p>
          <div className="pub-links">
            <a
              href="https://arxiv.org/abs/2607.28662"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
            >
              arXiv ↗
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
