export default function SoundToggle() {
  return (
    <button
      className="sound-toggle"
      id="sound-toggle"
      data-cursor="link"
      aria-pressed="false"
    >
      <span className="led" />
      <span id="sound-label">SOUND · OFF</span>
    </button>
  );
}
