import { useEffect, useRef, useState } from "react";

function normalize(option) {
  if (typeof option === "object" && option !== null) {
    return { value: option.value, label: option.label ?? option.value };
  }
  return { value: option, label: option };
}

export default function Dropdown({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const normalized = options.map(normalize);
  const current = normalized.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function selectOption(optionValue) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div className="dropdown" ref={wrapperRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={current ? "" : "dropdown-placeholder"}>
          {current ? current.label : placeholder}
        </span>
        <svg
          className={`dropdown-chevron${open ? " dropdown-chevron-open" : ""}`}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="dropdown-panel" role="listbox">
          {normalized.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`dropdown-option${option.value === value ? " dropdown-option-selected" : ""}`}
              onClick={() => selectOption(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
