export default function MatchBadge({ score }) {
  let className = "match-badge match-low";
  if (score >= 70) className = "match-badge match-high";
  else if (score >= 45) className = "match-badge match-medium";

  return <span className={className}>{score}% match</span>;
}