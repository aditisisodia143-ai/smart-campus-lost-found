import { Link } from "react-router-dom";
import MatchBadge from "./MatchBadge";

export default function ItemCard({ item, matchScore }) {
  return (
    <Link to={`/items/${item._id}`} className="item-card">
      <div className="item-card-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} />
        ) : (
          <div className="item-card-noimage">No image</div>
        )}
      </div>
      <div className="item-card-body">
        <div className="item-card-tags">
          <span className={`tag tag-${item.type}`}>{item.type}</span>
          <span className="tag tag-category">{item.category}</span>
          <span className={`tag tag-status-${item.status}`}>{item.status}</span>
        </div>
        <h3>{item.title}</h3>
        <p className="item-card-desc">{item.description}</p>
        <div className="item-card-meta">
          <span>📍 {item.location}</span>
          <span>📅 {new Date(item.date).toLocaleDateString()}</span>
        </div>
        {typeof matchScore === "number" && <MatchBadge score={matchScore} />}
      </div>
    </Link>
  );
}