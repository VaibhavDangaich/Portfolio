export default function DudeAvatar() {
  return (
    <div className="dude-rig" id="dude-rig" aria-hidden="true">
      <div className="dude-bubble" id="dude-bubble">
        <span id="dude-bubble-text">·</span>
      </div>
      <canvas id="dude-canvas" />
    </div>
  );
}
