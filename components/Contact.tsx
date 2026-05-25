export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 07 — Get in touch</span>
      </div>
      <h2 className="contact-hero" data-reveal="">
        <span className="arr">↳</span> Let&apos;s <em>build</em>
        <br />
        something.
      </h2>

      <div className="contact-grid" data-reveal-stagger="">
        <a href="mailto:vaibhavdangaich@gmail.com" data-cursor="link">
          <span className="k">Email</span>
          <span className="v">vaibhavdangaich@gmail.com</span>
        </a>
        <a href="tel:+917717785632" data-cursor="link">
          <span className="k">Phone</span>
          <span className="v">+91 77177 85632</span>
        </a>
        <a href="#" data-cursor="link">
          <span className="k">LinkedIn</span>
          <span className="v">/in/vaibhavdangaich ↗</span>
        </a>
        <a href="#" data-cursor="link">
          <span className="k">GitHub</span>
          <span className="v">@vaibhavdangaich ↗</span>
        </a>
        <a href="#" data-cursor="link">
          <span className="k">LeetCode</span>
          <span className="v">/u/vaibhavdangaich ↗</span>
        </a>
        <a href="#top" data-cursor="link">
          <span className="k">Back to top</span>
          <span className="v">↑ rewind</span>
        </a>
      </div>

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
