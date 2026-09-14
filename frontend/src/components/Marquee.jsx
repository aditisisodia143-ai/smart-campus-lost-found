export default function Marquee({ children }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </div>
    </div>
  );
}