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
        <a href="#projects" data-cursor="link">Projects</a>
        <a href="#stack" data-cursor="link">Stack</a>
        <a href="#contact" data-cursor="link">Contact</a>
      </nav>
      <div className="now">
        <span className="dot" />
        <span>Available · Summer &apos;26</span>
      </div>
    </div>
  );
}
