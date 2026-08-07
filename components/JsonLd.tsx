const BASE_URL = "https://portfolio-khaki-ten-24.vercel.app";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vaibhav Dangaich",
  url: BASE_URL,
  image: `${BASE_URL}/opengraph-image`,
  jobTitle: "AI/ML Developer & Student",
  description:
    "Final-year AI/ML student at BIT Mesra building LLM agents, knowledge graphs and real-time pipelines. First author of an arXiv preprint on ontology-guided knowledge graph extraction, and author of mnex — a cognitive-architecture AI coding agent.",
  email: "agent@chaosengineering.in",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "BIT Mesra",
    url: "https://www.bitmesra.ac.in",
  },
  sameAs: [
    "https://github.com/VaibhavDangaich",
    "https://www.npmjs.com/~vaibhav_dangaich",
    "https://www.linkedin.com/in/vaibhavdangaich",
    "https://leetcode.com/u/vaibhavdangaich",
  ],
  knowsAbout: [
    "Large Language Models",
    "Knowledge Graphs",
    "GraphRAG",
    "Retrieval-Augmented Generation",
    "LangChain",
    "LangGraph",
    "Neo4j",
    "Kùzu",
    "Apache Kafka",
    "Apache NiFi",
    "Microsoft Azure",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Node.js",
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "An Ontology-Guided, Deduplication-Aware Extraction Layer for Knowledge Graph Construction from Heterogeneous Documents",
  name: "An Ontology-Guided, Deduplication-Aware Extraction Layer for Knowledge Graph Construction from Heterogeneous Documents",
  author: [
    { "@type": "Person", name: "Vaibhav Dangaich" },
    { "@type": "Person", name: "Kevin Lewis" },
    { "@type": "Person", name: "Kundeshwar Pundalik" },
  ],
  datePublished: "2026-07",
  identifier: "arXiv:2607.28662",
  url: "https://arxiv.org/abs/2607.28662",
  publisher: { "@type": "Organization", name: "arXiv" },
  abstract:
    "Ontology-guided two-pass extraction with a locally hosted Qwen3.5-9B over a Kafka document stream. Live ontology-slice retrieval cut catalog overhead by ~94%, and a six-algorithm deduplication and embedding-resolution pipeline raised search recall from 70% to 95% with zero false merges.",
  keywords:
    "knowledge graphs, ontology, entity resolution, deduplication, information extraction, LLM",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vaibhav Dangaich",
  url: BASE_URL,
  description:
    "Portfolio of Vaibhav Dangaich — AI/ML developer, LLM engineer, and author of the mnex npm package.",
  author: { "@type": "Person", name: "Vaibhav Dangaich" },
};

const mnexSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "mnex",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux, macOS, Windows",
  url: "https://mnex-docs-site.vercel.app",
  downloadUrl: "https://www.npmjs.com/package/@vaibhav_dangaich/mnex",
  softwareHelp: {
    "@type": "CreativeWork",
    name: "mnex documentation",
    url: "https://mnex-docs-site.vercel.app",
  },
  softwareVersion: "1.5.1",
  description:
    "Cognitive-architecture AI coding agent with stateful LangGraph planner-critic loop, 5-tier memory, causal work graph, local-first routing, GitHub integration, eval harness, and plugin SDK.",
  author: { "@type": "Person", name: "Vaibhav Dangaich" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  keywords: "AI agent, LangGraph, LangChain, CLI, cognitive architecture, npm",
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mnexSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
