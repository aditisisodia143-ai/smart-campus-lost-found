import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api/api";
import { CATEGORIES } from "../constants";
import DatePicker from "../components/DatePicker";
import Dropdown from "../components/Dropdown";

const initialForm = {
  type: "lost",
  title: "",
  description: "",
  category: CATEGORIES[0],
  location: "",
  date: "",
  reporterName: "",
  reporterContact: "",
};

export default function ReportItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImageFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.date) {
      setError("Please select a date.");
      return;
    }
    setSubmitting(true);
    try {
     
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append("image", imageFile);

      const created = await createItem(formData);
      navigate(`/items/${created._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container narrow">
      <h1>Report a Lost or Found Item</h1>
      <p className="subtitle">
        Fill in as much detail as you can - the more specific the title and
        description, the better our matching algorithm can find a corresponding
        item.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Report type
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="lost"
                checked={form.type === "lost"}
                onChange={handleChange}
              />
              I lost something
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="found"
                checked={form.type === "found"}
                onChange={handleChange}
              />
              I found something
            </label>
          </div>
        </label>

        <label>
          Title
          <input
            type="text"
            name="title"
            placeholder="e.g. Black Dell Laptop"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            placeholder="Describe the item: color, brand, distinguishing marks, contents, etc."
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        <div className="form-row">
          <label>
            Category
            <Dropdown
              value={form.category}
              onChange={(category) => setForm((prev) => ({ ...prev, category }))}
              options={CATEGORIES}
            />
          </label>

          <label>
            Location
            <input
              type="text"
              name="location"
              placeholder="e.g. Central Library, 2nd floor"
              value={form.location}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Date {form.type === "lost" ? "lost" : "found"}
            <DatePicker
              value={form.date}
              onChange={(date) => setForm((prev) => ({ ...prev, date }))}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Your name
            <input
              type="text"
              name="reporterName"
              placeholder="Full name"
              value={form.reporterName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contact (email or phone)
            <input
              type="text"
              name="reporterContact"
              placeholder="you@college.edu or phone number"
              value={form.reporterContact}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Photo (optional, but strongly recommended)
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {preview && <img src={preview} alt="preview" className="image-preview" />}

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}