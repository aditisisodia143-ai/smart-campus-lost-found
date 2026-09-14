import { useEffect, useState, useCallback } from "react";
import { getItems } from "../api/api";
import ItemCard from "../components/ItemCard";
import { CATEGORIES } from "../constants";

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 400);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (type) params.type = type;
      if (category) params.category = category;
      if (debouncedKeyword) params.q = debouncedKeyword;
      const data = await getItems(params);
      setItems(data);
    } catch (err) {
      setError("Could not load items. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [type, category, debouncedKeyword]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="container">
      <div className="hero">
        <h1 className="hero-title">Welcome to ReUnite</h1>
      </div>

      <h2>Browse Lost &amp; Found Items</h2>
      <p className="subtitle">
        Search reported lost and found items across campus. Reporting a
        matching item? Post it and we'll suggest possible matches automatically.
      </p>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by keyword (e.g. wallet, ID card, laptop)..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading items...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p>No items found. Try adjusting your filters, or be the first to report one.</p>
      )}

      <div className="item-grid">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}