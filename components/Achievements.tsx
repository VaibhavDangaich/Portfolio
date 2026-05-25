export default function Achievements() {
  return (
    <section className="achieve" id="wins">
      <div className="section-label" data-reveal="">
        <span className="line" />
        <span>§ 06 — A few wins</span>
      </div>
      <h2 className="section-title" data-reveal="">
        Receipts.
      </h2>
      <div className="ach-grid">
        <div className="ach-card" data-reveal="" data-cursor="hover">
          <span className="corner">/ 01</span>
          <div className="big">400+</div>
          <div className="lbl">DSA problems solved</div>
          <p>
            Across LeetCode, Codeforces and GeeksforGeeks. Yes, I have a
            spreadsheet. No, I won&apos;t show it to you.
          </p>
        </div>
        <div className="ach-card" data-reveal="" data-cursor="hover">
          <span className="corner">/ 02</span>
          <div className="big">Top 5</div>
          <div className="lbl">IEEE CTF · BIT Mesra · 200+ teams</div>
          <p>
            Secured a top-5 finish at the IEEE Capture-The-Flag — solving
            real-world security challenges in a team of four, mostly on coffee
            and dread.
          </p>
        </div>
      </div>
    </section>
  );
}
