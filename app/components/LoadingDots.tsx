export default function LoadingDots() {
  return (
    <span className="inline-flex">
      <span className="animate-wave">.</span>
      <span className="animate-wave" style={{ animationDelay: "0.15s" }}>.</span>
      <span className="animate-wave" style={{ animationDelay: "0.3s" }}>.</span>
    </span>
  );
}
