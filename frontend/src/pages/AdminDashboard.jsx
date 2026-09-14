import { useEffect, useState, useCallback } from "react";
import { getItems, updateItemStatus, deleteItem } from "../api/api";
import { STATUSES } from "../constants";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await getItems(params);
      setItems(data);
    } catch (err) {
      setError("Failed to load items (are you still logged in?)");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleStatusChange(id, status) {
    try {
      await updateItemStatus(id, status);
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, status } : it)));
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">
        View every reported item and update its status as reports get resolved.
      </p>

      <div className="filter-bar">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Reporter</th>
                <th>Contact</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>
                    <span className={`tag tag-${item.type}`}>{item.type}</span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{item.reporterName}</td>
                  <td>{item.reporterContact}</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="link-button danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p>No items match this filter.</p>}
        </div>
      )}
    </div>
  );
}
