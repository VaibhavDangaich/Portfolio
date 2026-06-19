const BASE_URL = "https://portfolio-khaki-ten-24.vercel.app";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vaibhav Dangaich",
  url: BASE_URL,
  image: `${BASE_URL}/opengraph-image`,
  jobTitle: "AI/ML Developer & Student",
  description:
    "AI/ML student at BIT Mesra building LLM agents, knowledge graphs and real-time pipelines. Author of mnex — a cognitive-architecture AI coding agent.",
  email: "agent@chaosengineering.in",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "BIT Mesra",
    url: "https://www.bitmesra.ac.in",
  },
  worksFor: {
    "@type": "Organization",
    name: "Konect U",
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
    "LangChain",
    "LangGraph",
    "Neo4j",
    "Apache Kafka",
    "React",
    "Next.js",
    "Python",
    "Node.js",
  ],
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
  url: "https://www.npmjs.com/package/@vaibhav_dangaich/mnex",
  downloadUrl: "https://www.npmjs.com/package/@vaibhav_dangaich/mnex",
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
    </>
  );
}
