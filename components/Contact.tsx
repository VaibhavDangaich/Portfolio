import { MaskReveal, Stagger, StaggerLink } from "@/components/motion/Reveal";
import SectionLabel from "@/components/motion/SectionLabel";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <SectionLabel label="§ 08 — Get in touch" />

      {/* .contact-hero, not .section-title — so it gets the mask wipe directly
          rather than going through <SectionHead>. */}
      <MaskReveal>
        <h2 className="contact-hero">
          <span className="arr">↳</span> Let&apos;s <em>build</em>
          <br />
          something.
        </h2>
      </MaskReveal>

      <Stagger className="contact-grid">
        <StaggerLink href="mailto:vaibhavdangaich@gmail.com" dataCursor="link">
          <span className="k">Email</span>
          <span className="v">vaibhavdangaich@gmail.com</span>
        </StaggerLink>
        <StaggerLink href="tel:+917717785632" dataCursor="link">
          <span className="k">Phone</span>
          <span className="v">+91 77177 85632</span>
        </StaggerLink>
        <StaggerLink
          href="https://www.linkedin.com/in/vaibhavdangaich"
          target="_blank"
          rel="noopener noreferrer"
          dataCursor="link"
        >
          <span className="k">LinkedIn</span>
          <span className="v">/in/vaibhavdangaich ↗</span>
        </StaggerLink>
        <StaggerLink
          href="https://github.com/VaibhavDangaich"
          target="_blank"
          rel="noopener noreferrer"
          dataCursor="link"
        >
          <span className="k">GitHub</span>
          <span className="v">@VaibhavDangaich ↗</span>
        </StaggerLink>
        <StaggerLink
          href="https://leetcode.com/u/vaibhavdangaich"
          target="_blank"
          rel="noopener noreferrer"
          dataCursor="link"
        >
          <span className="k">LeetCode</span>
          <span className="v">/u/vaibhavdangaich ↗</span>
        </StaggerLink>
        <StaggerLink href="#top" dataCursor="link">
          <span className="k">Back to top</span>
          <span className="v">↑ rewind</span>
        </StaggerLink>
      </Stagger>

      <div className="footer">
        <div>
          © 2026 — Vaibhav Dangaich · hand-coded in HTML / no frameworks were
          harmed
        </div>
        <div className="marquee">
          <span>
            — last commit: today — built with three.js + raw js + too much chai
            — last commit: today — built with three.js + raw js + too much chai
            —{" "}
          </span>
        </div>
      </div>
    </section>
  );
}
