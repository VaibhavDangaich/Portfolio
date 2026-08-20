export default function TopBar() {
  return (
    <div className="topbar">
      <div className="mark">
        <span className="vd">Vaibhav.</span>
        <span>— Portfolio / 2026 · v01</span>
      </div>
      <nav className="nav">
        <a href="#about" data-cursor="link">About</a>
        <a href="#experience" data-cursor="link">Experience</a>
        <a href="#publications" data-cursor="link">Papers</a>
        <a href="#projects" data-cursor="link">Projects</a>
        <a href="#stack" data-cursor="link">Stack</a>
        <a href="#contact" data-cursor="link">Contact</a>
      </nav>
      <div className="topbar-links">
        <a
          href="https://github.com/VaibhavDangaich"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="icon-link"
          aria-label="GitHub"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.11 0 1.52-.01 2.75-.01 3.12 0 .3.2.66.79.55 4.52-1.51 7.77-5.76 7.77-10.78C23.02 5.24 18.27.5 12 .5Z" />
          </svg>
        </a>
        <a
          href="/resume/Vaibhav_Dangaich_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="resume-link"
        >
          <span>Résumé</span>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M8 1.5v9M8 10.5 4.5 7M8 10.5 11.5 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12.5v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className="now">
        <span className="dot" />
        <span>Open to roles · &apos;27</span>
      </div>
    </div>
  );
}
